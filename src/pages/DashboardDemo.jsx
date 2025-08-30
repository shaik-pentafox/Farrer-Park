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
  Box,
} from "@mantine/core";
import { IconArrowUp, IconPencil } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { COLORS } from "../config/Colors";
import { useChatStore } from "../store/ChatStore";

// 🏥 Patient Registration Flow
function* patientRegistrationFlow() {
  yield { text: "Sure. Please provide the patient’s full name." };
  yield {
    text: "Got it. Please provide Date of Birth (DOB) in DD-MM-YYYY.",
    validator: (input) =>
      /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(input),
    errorMessage: "⚠️ Please enter a valid DOB in DD-MM-YYYY format.",
  };
  yield { text: "Gender?", options: ["Male", "Female", "Others"] };
  yield {
    text: "Please enter contact number.",
    validator: (input) => /^[6-9]\d{9}$/.test(input),
    errorMessage: "⚠️ Please enter a valid 10-digit contact number.",
  };
  yield {
    text: "Please provide the patient’s address (House No, Street, City).",
  };
  yield { text: "Please provide a valid email address (optional)." };
  yield {
    text: "What is the patient’s marital status?",
    options: ["Single", "Married", "Divorced", "Widowed", "Separated"],
  };
  yield {
    text: "Could you share an emergency contact name and contact number?",
  };
  yield {
    text: "Please provide a government ID ",
    options: ["Aadhaar", "SSN", "Passport"],
  };
  yield { text: "Enter the ID details." };
  yield { text: "What is the patient’s blood group?" };
  yield {
    text: "Does the patient have medical insurance? If yes, please share provider and ID.",
  };
  yield {
    text: "Does the patient have any allergies or major medical history?",
  };
}

// 💳 Billing & Insurance Assistance Flow
function* billingInsuranceFlow() {
  yield {
    text: "Sure. Do you want to check CPF MediShield, Medisave, or Private Insurance?",
  };
  yield {
    text: "Please provide patient’s insurance ID / CPF number.",
  };
  yield {
    text: "Would you like to check billing breakdown (room charges, consultation, lab, pharmacy)?",
    options: ["Yes", "No"],
  };
  yield { text: "Would you like to generate an estimated bill summary?" };
  yield { text: "Do you need details on co-payment or deductible amount?" };
}

// 📄 GOP & LOG Assistance Flow
function* gopLogFlow() {
  yield {
    text: "Do you have a GOP (Guarantee of Payment) or LOG (Letter of Guarantee)?",
  };
  yield { text: "Please provide the insurance company / employer details." };
  yield { text: "Upload or enter GOP/LOG reference number." };
  yield {
    text: "Checking validity… ✅ If not valid, would you like to escalate?",
    options: ["Escalate to Billing", "Escalate to Insurance", "Cancel"],
  };
  yield { text: "Do you want to notify patient/family about the next steps?" };
}

// 📦 Hospital Packages Flow
function* hospitalPackagesFlow() {
  yield {
    text: "Are you looking for admission packages, maternity packages, or surgery packages?",
  };
  yield {
    text: "Please provide patient name and department (e.g., Orthopedic, Maternity).",
  };
  yield {
    text: "Here are the applicable packages. Would you like to select one?",
  };
  yield {
    text: "Do you want to tag this package to the patient’s admission record?",
  };
  yield { text: "Do you need to generate package cost estimate?" };
}

// 🏠 Post Discharge Support Flow
function* postDischargeFlow() {
  yield { text: "Has the patient been discharged already?" };
  yield { text: "Please provide patient ID or discharge date." };
  yield { text: "Would you like to schedule a follow-up review appointment?" };
  yield { text: "Does the patient require home care / nursing support?" };
  yield { text: "Do you want to send a post-discharge medication reminder?" };
  yield {
    text: "Would you like to share recovery instructions and contact info for support?",
  };
}

// ℹ️ General Information Flow
function* generalInfoFlow() {
  yield { text: "What information are you looking for?" };
  yield {
    text: "Options:",
    options: [
      "Visiting Hours",
      "Departments & Doctors",
      "Transport Contacts",
      "Hospital Facilities",
    ],
  };
  yield {
    text: "Do you need contact details of hospital helpline or ambulance service?",
  };
  yield { text: "Do you want directions to hospital (Google Maps link)?" };
  yield {
    text: "Would you like details of nearby pharmacy or lodging facilities?",
  };
}

// Appointment Scheduling Flow
// function* appointmentFlow() {
//   yield { text: "Got it. Please provide John’s DOB" };
//   yield {
//     text: "Would you like to use existing details or update insurance/contact info?",
//     options: ["Existing", "Update"],
//   };
//   yield { text: "Which department/doctor should I book the appointment for?" };
//   yield {
//     text: "Available slots for Dr. Smith (Cardiology):",
//     options: ["10:30 AM, Aug 27", "2:00 PM, Aug 27", "11:00 AM, Aug 28"],
//   };
//   yield { text: "Your appointment is scheduled" };
// }

// General Info / Queries Flow
// function* generalInfoFlow() {
//   yield {
//     text: "Visiting hours today are 10:00 AM – 12:00 PM and 5:00 PM – 7:00 PM.",
//   };
//   yield { text: "A patient wants to know if Dr. Patel is available today." };
//   yield {
//     text: "Checking... ✅ Dr. Patel (Orthopedics) is available today from 2:00 PM – 6:00 PM. Next available slot: 3:30 PM.",
//   };
//   yield { text: "A patient wants to know about insurance coverage." };
//   yield {
//     text: "The hospital accepts BlueCross, Aetna, UnitedHealth, and Medicare. For detailed plan coverage, please check the billing desk or upload insurance card via chatbot link.",
//   };
//   yield { text: "Can you share the OPD fee for general consultation?" };
//   yield {
//     text: "General OPD consultation fee is ₹500. Specialist consultation starts from ₹800.",
//   };
// }

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
  const path = location.pathname.slice(1);
  // const [messages, setMessages] = useState([]);
  const [label, setLabel] = useState(path);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { addConversation, addMessage, getConversation, updateLabel } =
    useChatStore();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const labelRef = useRef(null);
  const botGenRef = useRef(null);
  const effectRan = useRef(false);

  // Initialize conversation in store
  const [conversationId, setConversationId] = useState(null);
  // console.log(conversationId,'-->')

  useEffect(() => {
    if (effectRan.current) return; // skip if already ran
    if (path == "history") {
      setConversationId(location.state.id);
      setLabel(location.state.label);
    } else {
      const convId = addConversation(path); // create new conversation in store
      console.log(convId, path);
      setConversationId(convId);
      let initialMsg;
      if (path == "Registration") {
        botGenRef.current = patientRegistrationFlow();
        initialMsg = "Register a new patient.";
      } else if (path == "Billing") {
        botGenRef.current = billingInsuranceFlow();
        initialMsg = "Check patient’s billing and insurance details.";
      } else if (path == "Gop-Log") {
        botGenRef.current = gopLogFlow();
        initialMsg = "Verify GOP/LOG for insurance coverage.";
      } else if (path == "Packages") {
        botGenRef.current = hospitalPackagesFlow();
        initialMsg = "Show available hospital packages.";
      } else if (path == "Post-Discharge") {
        botGenRef.current = postDischargeFlow();
        initialMsg = "Assist with post-discharge support.";
      } else if (path == "Info") {
        botGenRef.current = generalInfoFlow();
        initialMsg = "What are today's visiting hours?";
      } else {
        botGenRef.current = botFlow();
        initialMsg = location.state;
      }

      // ✅ Pass convId explicitly instead of relying on state
      console.log(initialMsg, "msg");
      handleSend(initialMsg, convId);
    }
    effectRan.current = true;
    inputRef.current?.focus();
  }, []);

  const messages = conversationId
    ? getConversation(conversationId)?.messages || []
    : [];

  const handleSend = (message, overrideConvId) => {
    const cid = overrideConvId ?? conversationId;
    if (!cid) {
      console.warn("⚠️ No conversation id yet!");
      return;
    }
    const text = message ?? input;
    console.log(message, cid);
    if (!text.trim()) return;
    setLoading(true);
    setInput("");

    // add user message to store
    addMessage(cid, { sender: "user", text });

    setTimeout(() => {
      // find the last bot question
      const lastBotMsg = [...messages]
        .reverse()
        .find((m) => m.sender === "bot");

      // run validation on the last bot step
      if (lastBotMsg && lastBotMsg.validator && !lastBotMsg.validator(text)) {
        addMessage(cid, {
          sender: "bot",
          text: lastBotMsg.errorMessage,
          options: lastBotMsg.options,
          validator: lastBotMsg.validator,
          errorMessage: lastBotMsg.errorMessage,
        });
        setLoading(false);
        return; // STOP — don't move to next step
      }

      // ✅ only advance if valid
      const nextBot = botGenRef.current.next();
      if (nextBot.done || !nextBot.value) {
        addMessage(cid, {
          sender: "bot",
          text: "Sorry, I can't process that right now. Please try again later.",
        });
        setLoading(false);
        return;
      }

      const step = nextBot.value;

      // Save bot step (including validator + options if present)
      addMessage(cid, {
        sender: "bot",
        text: step.text,
        options: step.options,
        validator: step.validator,
        errorMessage: step.errorMessage,
      });

      setLoading(false);
    }, 700);
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // console.log(messages)
  }, [messages]);
  const [isEditing, setIsEditing] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <Paper h="100vh" py="md">
      {/* Label */}
      <Group
        gap="xs"
        align="center"
        w="100%"
        h={70}
        p="md"
        onMouseEnter={() => setShowIcon(true)}
        onMouseLeave={() => setShowIcon(false)}
      >
        <Text
          ref={labelRef}
          c={COLORS.brand[6]}
          ta={"start"}
          fz={30}
          fw={600}
          contentEditable={isEditing}
          suppressContentEditableWarning
          // onBlur={(e) => {
          //   setLabel(e.currentTarget.textContent);
          //   setIsEditing(false);
          // }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // prevent newline
              setIsEditing(false);
              updateLabel(
                conversationId,
                e.currentTarget.textContent?.trim() || ""
              );
            }
          }}
          style={{
            outline: "none",
            cursor: isEditing ? "text" : "default",
            borderBottom: isEditing ? "1px dashed gray" : "none",
          }}
        >
          {label}
        </Text>

        {!isEditing && (
          <IconPencil
            color="gray"
            size={30}
            onClick={() => {
              setIsEditing(true),
                setTimeout(() => labelRef.current?.focus(), 0);
            }}
            style={{
              opacity: showIcon ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        )}
      </Group>
      <Flex
        direction="column"
        justify="flex-end"
        h="calc(100% - 70px)"
        align={"center"}
      >
        {/* Chat Area */}
        <ScrollArea viewportRef={scrollRef} w={"100%"}>
          <Flex direction="column" gap="sm" px="16%" py="sm">
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1; // ✅ check latest message
              return (
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
                      <RadioGroup
                        mt="xs"
                        onChange={(val) => {
                          setInput(val), inputRef.current?.focus();
                        }}
                      >
                        <Group>
                          {msg.options.map((opt) => (
                            <Radio key={opt} value={opt} label={opt} />
                          ))}
                        </Group>
                      </RadioGroup>
                    )}
                  </Paper>
                </Flex>
              );
            })}
            {loading && <Loader type="dots" />}
          </Flex>
        </ScrollArea>

        {/* Input Area */}
        <Group w={"70%"}>
          <TextInput
            placeholder="Message ..."
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            // leftSection={<IconPencil size={20} style={{ marginLeft: 10 }} />}
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
