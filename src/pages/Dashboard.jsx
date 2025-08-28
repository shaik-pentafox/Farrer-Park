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
  yield { text: "Gender?", options: ["Male", "Female", "Others"],};
  yield { text: "Please enter contact number." };
  yield { text: "Please provide the patient’s address (House No, Street, City)." };
  yield { text: "Please provide a valid email address (optional)." };
  yield { text: "What is the patient’s marital status?", options: ["Single", "Married", "Divorced", "Widowed", 'Separated'] };
  yield { text: "Could you share an emergency contact name and contact number?" };
  yield { text: "Please provide a government ID ", options: ["Aadhaar", "SSN", "Passport"] };
  yield { text: "Enter the Id details" };
  yield { text: "What is the patient’s blood group?" };
  yield { text: "Does the patient have medical insurance? If yes, please share provider and ID." };
  yield { text: "Does the patient have any allergies or major medical history?" };
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
  yield { text: "Your appointment is scheduled" };
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
  yield { text: "Okay, let’s get started." };
  // yield {
  //   text: "Would you like to use existing details or update insurance/contact info?",
  //   options: ["Existing", "Update"],
  // };
  // yield { text: "Which department/doctor should I book the appointment for?" };
  // yield {
  //   text: "Available slots for Dr. Smith (Cardiology):",
  //   options: ["10:30 AM, Aug 27", "2:00 PM, Aug 27", "11:00 AM, Aug 28"],
  // };
}

// Fallback
const FALLBACK_MESSAGE = {
  text: "Sorry, I can't process that right now. Please try again later.",
  // options: ["Try now", "Help", "Exit"]
};


export default function Dashboard() {
  const location = useLocation();
  const path = location.pathname
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
      botGenRef.current = botFlow()
      handleSend(location.state);
    }
    effectRan.current = true;
  }, []);

  const handleSend = (message) => {
    const text = message ?? input; // use passed message, else input
    if (!text.trim()) return;
    setLoading(true)

    setMessages((prev) => [...prev, { sender: "user", text: text }]);

    // ✅ find last bot message
    const lastBotMsg = [...messages].reverse().find((m) => m.sender === "bot");

    // ✅ validation rules
    setTimeout(() => {
    if (lastBotMsg) {
        if (lastBotMsg.text.includes("Date of Birth") || lastBotMsg.text.includes("DOB")) {
          // format: DD/MM/YYYY or YYYY-MM-DD
          const dobRegex = /^(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[0-2])[\/\-]\d{4}$|^\d{4}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[12][0-9]|3[01])$/;
          if (!dobRegex.test(text)) {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "⚠️ Please enter a valid DOB (DD/MM/YYYY or YYYY-MM-DD)." },
            ]);
            setLoading(false);
            setInput("");
            return; // stop here, don’t progress generator
          }
        }
  
        if (lastBotMsg.text.includes("contact number")) {
          const phoneRegex = /^[6-9]\d{9}$/; // simple 10-digit Indian mobile
          if (!phoneRegex.test(text)) {
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "⚠️ Please enter a valid 10-digit contact number." },
            ]);
            setLoading(false);
            setInput("");
            return;
          }
        }
        
      }
      
      
      
      
      // Fake bot reply
      const nextBot = botGenRef.current.next();
      const botMsg = nextBot.done || !nextBot.value ? FALLBACK_MESSAGE : nextBot.value;
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", ...botMsg }]);
        setLoading(false);
      }, 500); // simulate delay
      
      setInput("");
    }, 300);
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
