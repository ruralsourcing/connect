import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { OperationDefinitionNode } from "graphql";
import { useState } from "react";
import { useAuth } from "../AuthenticationContext";
import { ApolloAuthContext } from "./types";

export const useProvideApolloAuth = (): ApolloAuthContext => {
  const [token, setToken] = useState<string>();
  const auth = useAuth();
  const httpLink = createHttpLink({
    uri: "/graphql",
  });

  auth.onToken((token: string) => {
    setToken(token);
  })

  const authLink = setContext(async (_, { headers }) => {
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
      connectionParams: {
        authToken:  token,
        test: 'some_ther_thing',
      },
    },
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(
        query
      ) as OperationDefinitionNode;
      auth.token();
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
