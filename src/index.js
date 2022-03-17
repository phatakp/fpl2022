import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/home.css";
import "./styles/loader.css";
import "./styles/match.css";
import "./styles/matches.css";
import "./styles/navbar.css";
import "./styles/rules.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
