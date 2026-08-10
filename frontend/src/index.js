import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If the page was prerendered (static HTML present), hydrate; otherwise mount.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
