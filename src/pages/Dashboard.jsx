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
  Loader,
} from "@mantine/core";
import { IconArrowUp, IconPencil } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";

// Patient Registration Flow
function* patientRegistrationFlow() {
  yield { text: "Sure. Please provide the patient’s full name." };
  yield { text: "Got it. Please provide Date of Birth (DOB)." };
  yield {
    text: "Gender?",
    options: ["Male", "Female", "Others"],
  };
  yield { text: "Please enter contact number." };
}

// Appointment Scheduling Flow
function* appointmentFlow() {
  yield { text: "Got it. Please provide John’s DOB" };
  yield {
    text: "Would you like to use existing details or update insurance/contact info?",
    options: ["Existing", "Update"],
  };
  yield { text: "Which department/doctor should I book the appointment for?" };
  yield {
    text: "Available slots for Dr. Smith (Cardiology):",
    options: ["10:30 AM, Aug 27", "2:00 PM, Aug 27", "11:00 AM, Aug 28"],
  };
}

// General Info / Queries Flow
function* generalInfoFlow() {
  yield { text: "Visiting hours today are 10:00 AM – 12:00 PM and 5:00 PM – 7:00 PM." };
  yield { text: "A patient wants to know if Dr. Patel is available today." };
  yield { text: "Checking... ✅ Dr. Patel (Orthopedics) is available today from 2:00 PM – 6:00 PM. Next available slot: 3:30 PM." };
  yield { text: "A patient wants to know about insurance coverage." };
  yield { text: "The hospital accepts BlueCross, Aetna, UnitedHealth, and Medicare. For detailed plan coverage, please check the billing desk or upload insurance card via chatbot link." };
  yield { text: "Can you share the OPD fee for general consultation?" };
  yield { text: "General OPD consultation fee is ₹500. Specialist consultation starts from ₹800." };
}

// Dummy
function* botFlow() {
  yield { text: "Got it. Please provide John’s DOB" };
  yield {
    text: "Would you like to use existing details or update insurance/contact info?",
    options: ["Existing", "Update"],
  };
  yield { text: "Which department/doctor should I book the appointment for?" };
  yield {
    text: "Available slots for Dr. Smith (Cardiology):",
    options: ["10:30 AM, Aug 27", "2:00 PM, Aug 27", "11:00 AM, Aug 28"],
  };
}

// Fallback
const FALLBACK_MESSAGE = {
  text: "Sorry, I can't process that right now. Please try again later.",
  // options: ["Try now", "Help", "Exit"]
};


export default function Dashboard() {
  const location = useLocation();
  const path = location.pathname
  console.log(location.pathname)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const effectRan = useRef(false);
  const botGenRef = useRef(null);

  useEffect(() => {
    if (effectRan.current) return; // skip if already ran
    if (path == '/appointment') {
      botGenRef.current = appointmentFlow()
      handleSend("Schedule a new appointment for John Doe.");
    } else if (path == '/registration') {
      botGenRef.current = patientRegistrationFlow()
      handleSend("Register a new patient.");
    } else if (path == '/faq') {
      botGenRef.current = generalInfoFlow()
      handleSend("What are today's visiting hours?");
    } else {
      botGenRef.current = generalInfoFlow()
      handleSend("What are today's visiting hours?");
    }
    effectRan.current = true;
  }, []);

  const handleSend = (message) => {
    setLoading(true)
    const text = message ?? input; // use passed message, else input
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: text }]);

    // Fake bot reply
    const nextBot = botGenRef.current.next();
    const botMsg = nextBot.done || !nextBot.value ? FALLBACK_MESSAGE : nextBot.value;
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", ...botMsg }]);
      setLoading(false);
    }, 800); // simulate delay

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
            {loading && <Loader type="dots" />}
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
