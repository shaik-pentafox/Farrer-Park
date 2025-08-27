import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import App from "./App.jsx";

// CSS
import "./index.css";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from "@mantine/notifications";
import { COLORS } from "./config/Colors.js";

const theme = createTheme({
  colors: {
    brand: COLORS.brand,
  },
  primaryColor: "brand",
  focusRing: "never"
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme} >
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </StrictMode>
);
