import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthenticationContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteProps,
} from "react-router-dom";

import { Container, Typography, Button, Menu, MenuItem } from '@material-ui/core';

import Home from "./pages/Home";
import Skills from "./pages/Skills";
import AffirmationsPage from "./pages/Affirmations";
import User from "./components/User";
import { ApolloAuthProvider } from "./context/ApolloAuthContext/ApolloAuthContext";
import IntegrationsPage from "./pages/Integrations";
import { SnackBarProvider } from "./context/AlertContext/SnackBarProvider";


const PrivateRoute = ({ children, ...rest }: RouteProps): JSX.Element => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? children : <h1>Not Authorized</h1>
      }
    />
  );
};

function App() {

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <SnackBarProvider>
    <AuthProvider>
      <ApolloAuthProvider>
        <Router>
          <Container>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            Open Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}><Link to="/">Home</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to="/skills">Skills</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to="/affirmations">Affirmations</Link></MenuItem>
            <MenuItem onClick={handleClose}><Link to="/integrations">Integrations</Link></MenuItem>
            <MenuItem><User /></MenuItem>
          </Menu>
              <Switch>
                <PrivateRoute path="/skills">
                  <Skills />
                </PrivateRoute>
                <PrivateRoute path="/integrations">
                  <IntegrationsPage />
                </PrivateRoute>
                <PrivateRoute path="/affirmations">
                  <AffirmationsPage />
                </PrivateRoute>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            <Typography style={{ textAlign: "center" }}>
              CASpR © 2020 Created by David Federspiel
            </Typography>
          </Container>
        </Router>
      </ApolloAuthProvider>
    </AuthProvider>
    </SnackBarProvider>
  );
}

export default App;
