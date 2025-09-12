import App from "./App";
import "pixel-react/lib/styles.css";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider, Toastify } from "pixel-react";

const root = document.getElementById("xmlGenerator");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider>
        <Toastify />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
}
