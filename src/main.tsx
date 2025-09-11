import App from "./App";
import "pixel-react/lib/styles.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "pixel-react";

const root = document.getElementById("xmlGenerator");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}
