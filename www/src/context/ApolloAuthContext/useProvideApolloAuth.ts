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
import { ConnectionParams } from "subscriptions-transport-ws";
import { useAuth } from "../AuthenticationContext";
import { ApolloAuthContext } from "./types";

export const useProvideApolloAuth = (): ApolloAuthContext => {
  // const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  // const [token, setToken] = useState<string>();
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
      // connectionParams: {
      //   authToken:  'token',
      //   test: 'some_ther_thing',
      // },
      connectionParams: (): Promise<ConnectionParams> => {
        return new Promise<ConnectionParams>(async (resolve, reject) => {
          try {
            const token = await auth.token();
            console.log('[TOKEN]', token);
            resolve({ authToken: token, test: "some_other_thing" });
          } catch (ex) {
            reject(ex);
          }
        });
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
