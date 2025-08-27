import { useEffect, useRef, useState } from "react";
import {
  Paper,
  TextInput,
  ActionIcon,
  Text,
  Group,
  Flex,
  ScrollArea,
  RadioCard,
  Radio,
  RadioGroup,
} from "@mantine/core";
import { IconArrowUp, IconPencil } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";

export default function DashboardDemo() {
  const location = useLocation();
  console.log(location.pathname)
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 How can I help you today?", options: ['Male', 'Female'] },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(()=> {
    setInput('Schedule a new appointment for John Doe.')
    handleSend()
  },[])

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Fake bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a dummy response 🤖" },
      ]);
    }, 800);

    setInput("");
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    console.log(messages)
  }, [messages]);

  return (
    <Paper h="100vh" p="md">
      <Flex direction="column" justify="flex-end" h="100%" align={"center"}>
        {/* Chat Area */}
        <ScrollArea viewportRef={scrollRef} w={"100%"} px="15%">
          <Flex direction="column" gap="sm" p="md">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1; // ✅ check latest message
              return(
              <Flex
                key={idx}
                justify={msg.sender === "user" ? "flex-end" : "flex-start"}
              >
                <Paper
                  p="sm"
                  radius="lg"
                  bg={msg.sender === "user" ? "#eea8b8ff" : "#FFE6EC"}
                  style={{ maxWidth: "70%" }}
                >
                  <Text size="sm">{msg.text}</Text>
                  {isLast && msg.options && (
                    <RadioGroup mt="xs" onChange={(val) => {setInput(val), inputRef.current?.focus(); }} >
                      <Group>
                        {msg.options.map((opt) => (
                          <Radio key={opt} value={opt} label={opt} />
                        ))}
                      </Group>
                    </RadioGroup>
                  )}
                </Paper>
              </Flex>
            )})}
          </Flex>
        </ScrollArea>

        {/* Input Area */}
        <Group mt="md" w={"70%"}>
          <TextInput
            placeholder="Message ..."
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            leftSection={<IconPencil size={20} style={{ marginLeft: 10 }} />}
            rightSection={
              <ActionIcon
                radius="xl"
                size={40}
                onClick={handleSend}
                style={{ marginRight: 25 }}
              >
                <IconArrowUp color="white" />
              </ActionIcon>
            }
            styles={{
              input: {
                height: 56,
                borderRadius: 40,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
            w="100%"
          />
        </Group>
      </Flex>
    </Paper>
  );
}
