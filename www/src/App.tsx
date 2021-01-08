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
import { Layout, Row, Menu, Breadcrumb, Col } from "antd";
import Home from "./pages/Home";
import Skills from "./pages/Skills";
import User from "./components/User";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  createHttpLink,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";
import { OperationDefinitionNode } from "graphql";

console.log(process.env);
console.log("[APOLLO SERVER]", process.env.REACT_APP_APOLLO_SERVER);
console.log("[APOLLO WS HOST]", process.env.REACT_APP_APOLLO_WS_HOST);

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = "123";
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsLink = new WebSocketLink({
  uri: `${process.env.REACT_APP_APOLLO_WS_HOST}/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query
    ) as OperationDefinitionNode;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

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
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}

export default App;
