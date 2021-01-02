import React, { useEffect } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthenticationContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  RouteProps,
} from "react-router-dom";
import { Layout, Row, Menu, Breadcrumb, Col } from "antd";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import User from "./components/User";
import axios from "axios";

const { Header, Content, Footer } = Layout;
const PrivateRoute = ({ children, ...rest }: RouteProps): JSX.Element => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
            <h1>Not Authorized</h1>
          )
      }
    />
  );
};

function App() {
  return (
    <AuthProvider>
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
              </Menu>
            </Row>
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Row>
              <Col span={20}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col style={{ textAlign: "right" }} span={4}>
                <User />
              </Col>
            </Row>
            <Switch>
              <PrivateRoute path="/skills">
                <Skills />
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
    </AuthProvider>
  );
}

export default App;
