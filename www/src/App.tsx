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
import { Layout, Row, Menu, Col } from "antd";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import AffirmationsPage from "./pages/Affirmations";
import User from "./components/User";
import { ApolloAuthProvider } from "./context/ApolloAuthContext/ApolloAuthContext";
import IntegrationsPage from "./pages/Integrations";

const { Header, Content, Footer } = Layout;

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
  return (
    <AuthProvider>
      <ApolloAuthProvider>
        <Router>
          <Layout>
            <Header>
              <Row>
                <Menu theme="dark" mode="horizontal">
                  <Menu.Item key="1">
                    <Link to="/">Home</Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link to="/skills">Skills</Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/affirmations">Affirmations</Link>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <Link to="/integrations">Integrations</Link>
                  </Menu.Item>
                </Menu>
              </Row>
            </Header>
            <Content style={{ padding: "0 50px" }}>
              <Row>
                <Col style={{ textAlign: "right" }} span={24}>
                  <User />
                </Col>
              </Row>
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
            </Content>
            <Footer style={{ textAlign: "center" }}>
              CASpR © 2020 Created by David Federspiel
            </Footer>
          </Layout>
        </Router>
      </ApolloAuthProvider>
    </AuthProvider>
  );
}

export default App;
