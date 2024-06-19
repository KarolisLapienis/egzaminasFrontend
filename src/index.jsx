// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { darkTheme } from "./themes/theme"; // Import custom theme

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider
    defaultColorScheme="dark"
    theme={darkTheme} // Apply the custom theme
    withGlobalStyles
    withNormalizeCSS
  >
    <App />
  </MantineProvider>
);
