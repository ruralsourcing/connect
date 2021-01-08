import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { OperationDefinitionNode } from "graphql";
import { useAuth } from "../AuthenticationContext";
import { ApolloAuthContext } from "./types";

export const useProvideApolloAuth = (): ApolloAuthContext => {
  const auth = useAuth();
  const httpLink = createHttpLink({
    uri: "/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await auth.token();
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

  return {
    client,
  };
};
