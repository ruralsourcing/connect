import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthenticationContext";
import { ToastProvider } from "react-toast-notifications";
import { NotificationProvider } from './context/NotificationContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  RouteProps
} from "react-router-dom";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import User from "./components/User";

const PrivateRoute = ({ children, ...rest }: RouteProps): JSX.Element => {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

function App() {
  return (
    <ToastProvider autoDismiss>
      <NotificationProvider>
        <AuthProvider>
          <User />
          {/* <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              
            </header>
          </div> */}
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/skills">Skills</Link>
                  </li>
                </ul>
              </nav>

              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <PrivateRoute path="/skills">
                  <Skills />
                </PrivateRoute>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;
