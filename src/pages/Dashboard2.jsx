import { useEffect, useRef, useState } from "react";
import {
  Paper,
  TextInput,
  ActionIcon,
  Text,
  Group,
  Flex,
  ScrollArea,
  Radio,
  RadioGroup,
  Loader,
} from "@mantine/core";
import { IconArrowUp, IconPencil } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { COLORS } from "../config/Colors";
import { useChatStore } from "../store/ChatStore";

// ---------------- FLOWS ----------------

// Patient Registration
const patientRegistrationFlow = {
  start: {
    text: "Sure. Please provide the patient’s full name.",
    validator: (input) => /^[A-Za-z]+(\s[A-Za-z]+)*$/.test(input),
    errorMessage: "⚠️ Please enter a valid full name.",
    next: "dob", // always goes to dob step
  },
  dob: {
    text: "Got it. Please provide Date of Birth (DOB) in DD-MM-YYYY.",
    validator: (input) =>
      /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(input),
    errorMessage: "⚠️ Please enter DOB in DD-MM-YYYY format.",
    next: "gender",
  },
  gender: {
    text: "Gender?",
    options: ["Male", "Female", "Others"],
    next: {
      Male: "maritalStatus", // 👈 jump based on option
      Female: "pregnancyCheck",
      Others: "maritalStatus",
    },
  },
  pregnancyCheck: {
    text: "Is the patient pregnant?",
    options: ["Yes", "No"],
    next: {
      Yes: "maternityPackage",
      No: "maritalStatus",
    },
  },
  maritalStatus: {
    text: "What is the patient’s marital status?",
    options: ["Single", "Married", "Divorced", "Widowed", "Separated"],
    next: "contact",
  },
  maternityPackage: {
    text: "Would you like to see maternity care packages?",
    options: ["Yes", "No"],
    next: {
      Yes: "showPackages",
      No: "contact",
    },
  },
  showPackages: {
    text: "Here are the maternity packages available...",
    next: "contact",
  },
  contact: {
    text: "Please enter contact number.",
    validator: (input) => /^[6-9]\d{9}$/.test(input),
    errorMessage: "⚠️ Enter a valid 10-digit number.",
    next: 'end', // end
  },
};

// // Billing
// const billingInsuranceFlow = [
//   {
//     text: "Sure. Do you want to check CPF MediShield, Medisave, or Private Insurance?",
//   },
//   { text: "Please provide patient’s insurance ID / CPF number." },
//   {
//     text: "Would you like to check billing breakdown?",
//     options: ["Yes", "No"],
//   },
//   { text: "Would you like to generate an estimated bill summary?" },
// ];

// // GOP & LOG
// const gopLogFlow = [
//   {
//     text: "Do you have a GOP (Guarantee of Payment) or LOG (Letter of Guarantee)?",
//   },
//   { text: "Please provide the insurance company / employer details." },
//   { text: "Upload or enter GOP/LOG reference number." },
//   {
//     text: "Checking validity… ✅ If not valid, would you like to escalate?",
//     options: ["Escalate to Billing", "Escalate to Insurance", "Cancel"],
//   },
//   { text: "Do you want to notify patient/family about the next steps?" },
// ];

// // Hospital Packages
// const hospitalPackagesFlow = [
//   {
//     text: "Are you looking for admission packages, maternity packages, or surgery packages?",
//   },
//   {
//     text: "Please provide patient name and department (e.g., Orthopedic, Maternity).",
//   },
//   { text: "Here are the applicable packages. Would you like to select one?" },
//   {
//     text: "Do you want to tag this package to the patient’s admission record?",
//   },
//   { text: "Do you need to generate package cost estimate?" },
// ];

// // Post Discharge
// const postDischargeFlow = [
//   { text: "Hope you’re recovering well! Can you please confirm the patient’s full name?" },
//   { text: "Please provide the Date of Discharge (DD-MM-YYYY)." },
//   {
//     text: "Would you like to review or update discharge instructions/medications?",
//     options: ["Review", "Update"],
//   },
//   {
//     text: "Do you need to schedule a follow-up consultation?",
//     options: ["Yes", "No"],
//   },
//   {
//     text: "Available follow-up slots with Dr. Smith:",
//     options: ["10:30 AM, Sep 2", "2:00 PM, Sep 3", "11:00 AM, Sep 4"],
//   },
//   { text: "Your post-discharge follow-up has been scheduled. Wishing you a smooth recovery!" },
// ];

// // General Info
// const generalInfoFlow = [
//   { text: "What information are you looking for?" },
//   {
//     text: "Options:",
//     options: [
//       "Visiting Hours",
//       "Departments & Doctors",
//       "Transport Contacts",
//       "Hospital Facilities",
//     ],
//   },
//   {
//     text: "Do you need contact details of hospital helpline or ambulance service?",
//   },
//   { text: "Do you want directions to hospital (Google Maps link)?" },
//   { text: "Would you like details of nearby pharmacy or lodging facilities?" },
// ];

// // Appointment Scheduling
// const appointmentFlow = [
//   { text: "Got it. Please provide John’s DOB" },
//   {
//     text: "Would you like to use existing details or update insurance/contact info?",
//     options: ["Existing", "Update"],
//   },
//   { text: "Which department/doctor should I book the appointment for?" },
//   {
//     text: "Available slots for Dr. Smith (Cardiology):",
//     options: ["10:30 AM, Aug 27", "2:00 PM, Aug 27", "11:00 AM, Aug 28"],
//   },
//   { text: "Your appointment is scheduled" },
// ];

// ---------------- COMPONENT ----------------

export default function Dashboard() {
  const location = useLocation();
  const path = location.pathname.slice(1);

  const [label, setLabel] = useState(path);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { addConversation, addMessage, getConversation, updateLabel } =
    useChatStore();

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const labelRef = useRef(null);
  const flowRef = useRef(null); // holds { steps, currentStep }
  const effectRan = useRef(false);

  const [conversationId, setConversationId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (effectRan.current) return;
    
    if (path === "history") {
      setConversationId(location.state.id);
      setLabel(location.state.label);
    } else {
      const convId = addConversation(path);
      setConversationId(convId);

      let steps = [];
      let initialMsg = "";

      switch (path) {
        case "Registration":
          steps = patientRegistrationFlow;
          initialMsg = "Register a new patient.";
          break;
        // case "Billing":
        //   steps = billingInsuranceFlow;
        //   initialMsg = "Check patient’s billing and insurance details.";
        //   break;
        // case "GOP-LOG":
        //   steps = gopLogFlow;
        //   initialMsg = "Assist with GOP / LOG.";
        //   break;
        // case "Packages":
        //   steps = hospitalPackagesFlow;
        //   initialMsg = "Show hospital packages.";
        //   break;
        // case "Post-Discharge":
        //   steps = postDischargeFlow;
        //   initialMsg = "Post discharge support.";
        //   break;
        // case "Info":
        //   steps = generalInfoFlow;
        //   initialMsg = "General hospital info.";
        //   break;
        // case "Appointment":
        //   steps = appointmentFlow;
        //   initialMsg = "Book an appointment.";
        //   break;
        default:
          steps = [{ text: "Okay, let’s get started." }];
          initialMsg = location.state;
      }

      flowRef.current = { steps, currentStepId: 'start' };

      // send initial message
      handleSend(initialMsg, convId);
    }

    effectRan.current = true;
    inputRef.current?.focus();
  }, []);

  const messages = conversationId ? getConversation(conversationId)?.messages || [] : [];
  console.log(conversationId,messages)

  // ---------------- SEND HANDLER ----------------
  const handleSend = (message, overrideConvId) => {
    const cid = overrideConvId ?? conversationId;
    const text = message ?? input;
    if (!text.trim()) return;

    setLoading(true);
    setInput("");

    // Special case for initial flow setup (when called from useEffect)
    if (overrideConvId && !conversationId) {
      // This is the initial message, just add user message and set up first bot response
      addMessage(cid, { sender: "user", text });
      
      setTimeout(() => {
        const flow = flowRef.current;
        if (flow && flow.steps && flow.steps.start) {
          const firstStep = flow.steps.start;
          addMessage(cid, {
            sender: "bot",
            text: firstStep.text,
            options: firstStep.options,
            next: firstStep.next,
            validator: firstStep.validator,
            errorMessage: firstStep.errorMessage,
          });
        }
        setLoading(false);
      }, 600);
      return;
    }

    // Add user message for regular flow
    addMessage(cid, { sender: "user", text });

    setTimeout(() => {
      const flow = flowRef.current;
      if (!flow) {
        addMessage(cid, { sender: "bot", text: "Sorry, I couldn't process that right now. Please try again in a while. Thank you for your patience!" });
        setLoading(false);
        return;
      }

      const currentStep = flow.steps[flow.currentStepId];
      
      // Step 1: Validate current step input if validator exists
      if (currentStep && currentStep.validator) {
        if (!currentStep.validator(text)) {
          // Validation failed - send error message and stay on same step
          addMessage(cid, {
            sender: "bot",
            text: currentStep.errorMessage,
            options: currentStep.options,
            validator: currentStep.validator,
            errorMessage: currentStep.errorMessage,
            next: currentStep.next
          });
          setLoading(false);
          return;
        }
      }

      // Step 2: Determine next step based on current step's next property
      let nextStepId = null;
      
      if (currentStep && currentStep.next) {
        if (typeof currentStep.next === "string") {
          // Simple string next step
          nextStepId = currentStep.next;
        } else if (typeof currentStep.next === "object" && currentStep.next !== null) {
          // Conditional next step based on user input
          nextStepId = currentStep.next[text];
          
          // If exact match not found, try to find a match (for options)
          if (!nextStepId) {
            const keys = Object.keys(currentStep.next);
            const matchedKey = keys.find(key => key.toLowerCase() === text.toLowerCase());
            if (matchedKey) {
              nextStepId = currentStep.next[matchedKey];
            }
          }
        }
      }

      console.log("Current Step ID:", flow.currentStepId);
      console.log("User Input:", text);
      console.log("Next Step ID:", nextStepId);

      // Step 3: Handle next step or end flow
      if (nextStepId && nextStepId !== "end" && flow.steps[nextStepId]) {
        // Move to next step
        flow.currentStepId = nextStepId;
        const nextStep = flow.steps[nextStepId];
        
        addMessage(cid, {
          sender: "bot",
          text: nextStep.text,
          options: nextStep.options,
          next: nextStep.next,
          validator: nextStep.validator,
          errorMessage: nextStep.errorMessage,
        });
      } else if (nextStepId === "end") {
        // Flow completed successfully
        addMessage(cid, {
          sender: "bot",
          text: "That's all I need. The process is complete.",
        });
        flow.currentStepId = null; // mark as finished
      } else {
        // Invalid step or flow error
        addMessage(cid, {
          sender: "bot",
          text: "I didn't understand that response. Please try again.",
          options: currentStep?.options,
          validator: currentStep?.validator,
          errorMessage: currentStep?.errorMessage,
          next: currentStep?.next
        });
      }

      setLoading(false);
    }, 600);
  };


  // auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ---------------- UI ---------------- //
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
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
              setIsEditing(true);
              setTimeout(() => labelRef.current?.focus(), 0);
            }}
            style={{
              opacity: showIcon ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        )}
      </Group>

      {/* Chat + Input */}
      <Flex
        direction="column"
        justify="flex-end"
        h="calc(100% - 70px)"
        align="center"
      >
        {/* Chat Area */}
        <ScrollArea viewportRef={scrollRef} w="100%">
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
                          setInput(val);
                          // inputRef.current?.focus();
                          handleSend(val);
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
        <Group w="70%">
          <TextInput
            placeholder="Message ..."
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
