

import App from "./App";
import "pixel-react/lib/styles.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ThemeProvider } from "pixel-react";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider>
            <App />
      </ThemeProvider>
    </StrictMode>
  );
}
