import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

if ("serviceWorker" in navigator) {
  const swUrl = new URL("./firebase-messaging-sw.js", import.meta.url);
  navigator.serviceWorker
    .register(swUrl, { type: "module" })
    .catch(console.error);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
