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
  ActionIcon,
  Image,
} from "@mantine/core";
import {
  IconEdit,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { COLORS } from "../config/Colors";
import './style.css'
import { useNavigate } from "react-router-dom";


const ListItem = ({ expand, label, onClick, iconComp }) => {
  return (
    <Tooltip hidden={expand} label={label} withArrow position="right" offset={14}>
     <UnstyledButton onClick={onClick} p={6}>
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
  const history = [
    "Jhon doe patient onboard...",
    "Alex patient onboarding",
    "Jesse doe patient onboard...",
    "Saul patient onboarding",
    "wills doe patient onboard...",
  ];

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
    <Box
      h="100vh"
      display="flex"
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid var(--mantine-color-gray-3)",
        transition: "width 0.2s ease",
      }}
    >
      {/* ---------- Top Section ---------- */}
      <Stack gap="sm" p="md">
        {/* Logo */}
        <Image
          src={expand ? "/FP-full-logo.png" : "/FP-logo.png"} // full logo when expanded
          alt="Logo"
          style={{
            width:'auto', // larger when expanded
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
          active={false}
        />

        {/* New Chat */}
        <ListItem
          expand={expand}
          label="New Chat"
          iconComp={<IconEdit {...iconProps} />}
          onClick={()=>navigate('/')}
          active={false}
        />

        {/* Search History */}
        <ListItem
          expand={expand}
          label="Search History"
          iconComp={<IconSearch {...iconProps} />}
          onClick={() => console.log("Search History")}
          active={true}
        />

        {/* History items */}
        {expand && (
          <Stack gap="sm" pt="xs" pl="sm" align="flex-start">
            {history.map((item, i) => (
              <Text
                key={i}
                size="sm"
                truncate
                c="dimmed"
                style={{ cursor: "pointer" }}
              >
                {item}
              </Text>
            ))}
          </Stack>
        )}
      </Stack>

      {/* ---------- Bottom Profile ---------- */}
      <Box p="sm" m='md' >
        <Group justify={expand ? "flex-start" : "center"} gap="sm">
          <Avatar size="md" radius="xl" name={user.name} color={COLORS.brand[6]} variant="outline" />
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
    </Box>
  );
};

export default Navigation;
