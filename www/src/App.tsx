import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "./context/AuthenticationContext";
import User from "./components/User";
import { ToastProvider } from "react-toast-notifications";
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ToastProvider autoDismiss>
      <NotificationProvider>
        <AuthProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <User />
            </header>
          </div>
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
