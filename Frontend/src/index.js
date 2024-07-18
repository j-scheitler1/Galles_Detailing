import React from "react";
import ReactDOM from "react-dom/client";
import "./Styles/reset.css";
import "./Styles/index.css";
import { Main } from "./App.js";
import { Ticket } from "./Ticket.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Admin from "./Admin.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route exact path="/tickets" element={<Ticket />} />
        <Route exact path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </>
);
