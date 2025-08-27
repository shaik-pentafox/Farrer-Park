import { AppShell, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import BG from '../assets/BG.png'

export const AppShellLayout = ({ children }) => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);

  return (
    <AppShell
      navbar={{ width: desktopOpened ? 270 : 72, breakpoint: "sm" }}
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <AppShell.Navbar>
        <Navigation expand={desktopOpened} onToggle={toggleDesktop} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Paper w="100%">{children || <Outlet />}</Paper>
      </AppShell.Main>
    </AppShell>
  );
};
