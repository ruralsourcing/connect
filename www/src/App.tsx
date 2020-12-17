import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "./context/AuthenticationContext";
import User from "./components/User";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <User />
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
