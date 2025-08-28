import { useEffect, useRef, useState } from "react";
import {
  Paper,
  TextInput,
  ActionIcon,
  Text,
  Group,
  Flex,
  ScrollArea,
  Card,
  SimpleGrid,
  Badge,
  Image,
} from "@mantine/core";
import { IconArrowUp, IconPencil, IconSparkles } from "@tabler/icons-react";
import { COLORS } from "../config/Colors";
import { useNavigate } from "react-router-dom";

export default function DashboardMain() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋 How can I help you today?" },
  ]);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [hovered, setHovered] = useState(null);
  const scrollRef = useRef(null);

  const cardData = [
  {
    title: "Appointment Scheduling & Management",
    description: "Patients can book, reschedule, or cancel appointments without waiting in line or on hold.",
    rout: 'appointment'
  },
  {
    title: "Patient Registration & Pre-Check-In",
    description: "Collects patient details, insurance information, and medical history before arrival.",
    rout: 'registration'
  },
  {
    title: "Real-Time Information & FAQs",
    description: "Answers common questions about visiting hours, doctor availability, departments, billing, and insurance coverage.",
    rout: 'faq'
  },
  {
    title: "Emergency Triage & Routing",
    description: "Guides patients to the right department based on reported symptoms.",
    rout: 'faq'
  },
  {
    title: "Billing & Insurance Assistance",
    description: "Explains billing breakdowns, accepted insurance plans, and co-payment details.",
    rout: 'faq'
  },
  {
    title: "Medication & Post-Care Support",
    description: "Provides prescription reminders and dosage instructions.",
    rout: 'faq'
  },
];


  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    navigate('test',{state: input})
    setInput("");
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <Paper h="100vh" p="md">
      <Flex direction="column" justify="flex-end" h="100%" align={"center"}>
        <Flex justify="flex-start" w="60%" my="xl">
          <Image src="/FP-full-logo.png" alt="Logo" h={50} w="auto" />
        </Flex>
        <SimpleGrid cols={3} spacing="lg" w="60%">
          {cardData.map((card, idx) => (
            <Card
              key={idx}
              // withBorder
              radius="lg"
              // shadow="sm"
              p="lg"
              bg="linear-gradient(135deg, #ffebfbff 0%, #e1eaffff 100%)"
              // bg="transparent"
              style={{
                border:
                  hovered === idx
                    ? `1px solid ${COLORS.purple}`
                    : "1px solid #f1f1f1ff",
                cursor: hovered === idx && "pointer",
                background: "rgba(255, 255, 255, 0.2)", // translucent white
                backdropFilter: "blur(1px)", // frosted glass blur
                WebkitBackdropFilter: "blur(1px)",
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(card.rout)}
            >
              <ActionIcon
                size="lg"
                radius="xl"
                color={hovered === idx && COLORS.purple}
                mb="sm"
                variant={hovered === idx ? "filled" : "white"}
              >
                <IconSparkles color={hovered === idx ? "white" : COLORS.pink} />
              </ActionIcon>
              <Text size="sm" fw={600} mb={4}>
                {card.title}
              </Text>
              <Text size="xs" c="dimmed">
                {card.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>

        {/* Input Area */}
        <Group mt="md" w={"60%"}>
          <TextInput
            placeholder="Message ..."
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
