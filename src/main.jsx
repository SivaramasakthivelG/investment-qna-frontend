import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="165233056285-h9bhd9f67c11ghspl57s0d2bogqcdocb.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
