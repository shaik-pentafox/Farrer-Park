// import { useState } from "react";
import {
  Box,
  Stack,
  Group,
  Text,
  Avatar,
  UnstyledButton,
  Tooltip,
  Flex,
  Image,
  Card,
  Menu,
  ScrollArea,
} from "@mantine/core";
import {
  IconDots,
  IconEdit,
  IconEye,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { COLORS } from "../config/Colors";
import './style.css'
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/ChatStore";


const ListItem = ({ expand, label, onClick, iconComp }) => {
  return (
    <Tooltip hidden={expand} label={label} withArrow position="right" offset={14}>
     <UnstyledButton onClick={onClick} className="nav-button" mr={'md'} p={6} >
        <Group justify="flex-start" gap="xs">
          <Flex align="center" direction="row" gap="md">
            {iconComp}
            <Text size="sm" hidden={!expand}>
              {label}
            </Text>
          </Flex>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
};

export const Navigation = ({ expand, onToggle }) => {
  const navigate = useNavigate();
  const { getConversationList, deleteConversation } = useChatStore();
  const conversationList = getConversationList();
  const user = {
    name: "Youssef Bsheer",
    phone: "+201094828532",
  };

  const iconProps = {
    size:24,
    stroke:1.3,
    color: COLORS.brand[6]
  }
  return (
    <Flex
      h="100vh"
      direction={'column'}
      justify={'space-between'}
    >
      {/* ---------- Top Section ---------- */}
      <Stack gap="sm" pl="md" pt='md'>
        {/* Logo */}
        <Image
          src={expand ? "/FP-full-logo.png" : "/FP-logo.png"} // full logo when expanded
          alt="Logo"
          style={{
            width: "auto", // larger when expanded
            height: 50, // maintain aspect ratio
            margin: "16px auto", // center horizontally
            transition: "all 0.2s ease",
          }}
        />
        {/* Toggle Sidebar */}
        <ListItem
          expand={expand}
          label={expand ? "Close sidebar" : "Open sidebar"}
          iconComp={
            expand ? (
              <IconLayoutSidebarLeftCollapse {...iconProps} />
            ) : (
              <IconLayoutSidebarRightCollapse {...iconProps} />
            )
          }
          onClick={onToggle}
        />

        {/* New Chat */}
        <ListItem
          expand={expand}
          label="New Chat"
          iconComp={<IconEdit {...iconProps} />}
          onClick={() => navigate("/")}
        />

        {/* Search History */}
        <ListItem
          expand={expand}
          label="Search History"
          iconComp={<IconSearch {...iconProps} />}
          onClick={() => console.log("Search History")}
        />

        {/* History items */}
        {expand && (
          <Box>
            <Text c={COLORS.brand[6]}>Chats</Text>
            <Flex h='50vh'>
              <ScrollArea w='100%'>
                <Stack gap={3} py="xs" align="flex-start">
                  {conversationList.map((i) => (
                    <Card
                      radius="md"
                      w="95%"
                      p={6}
                      bg='transparent'
                      style={{
                        transition: "background 0.2s, transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#a00a2f22"; // light gray bg
                        e.currentTarget.style.transform = "scale(1.01)"; // subtle lift
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Flex justify="space-between" w="100%">
                        <Text
                          key={i.id}
                          size="sm"
                          truncate
                        >
                          {i.label}
                        </Text>
                        <Menu>
                          <Menu.Target>
                            <IconDots style={{ cursor: "pointer" }} />
                          </Menu.Target>
                          <Menu.Dropdown bg='#ffeff3eb'>
                            <Menu.Item
                              onClick={() => navigate("history", { state: i })}
                              leftSection={<IconEye size={18} />}
                            >
                              View
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              onClick={() => {
                                deleteConversation(i.id), navigate("/");
                              }}
                              leftSection={<IconTrash size={18} />}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
            </Flex>
          </Box>
        )}
      </Stack>

      {/* ---------- Bottom Profile ---------- */}
      <Box p="sm" m="md">
        <Group justify={expand ? "flex-start" : "center"} gap="sm">
          <Avatar
            size="md"
            radius="xl"
            name={user.name}
            color={COLORS.brand[6]}
            variant="outline"
          />
          {expand && (
            <Box>
              <Text size="sm" fw={500}>
                {user.name}
              </Text>
              <Text size="xs" c="dimmed">
                {user.phone}
              </Text>
            </Box>
          )}
        </Group>
      </Box>
    </Flex>
  );
};

export default Navigation;
