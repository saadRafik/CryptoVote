import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use `react-dom/client`
import App from "./App";
import "./styles/global.scss"; // Ensure this path is correct

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
window.process = { ...window.process };

window.process = {
  env: {
    NODE_ENV: "development",
  },
};
