import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import { App as AntdApp } from "antd";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
console.log("🐛 [DEBUG] GOOGLE_CLIENT_ID: ", GOOGLE_CLIENT_ID);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <AuthProvider>
          <AntdApp>
            <App />
          </AntdApp>
        </AuthProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
