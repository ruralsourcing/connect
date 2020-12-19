import React, { useContext, createContext } from "react";
import { useProvideAuth } from "./useProvideAuth";
import { AuthContext } from "./types";
import AuthModule from "./AuthModule";
/**
 * AuthContext to be passed to any component that depends on user context.
 */
const authContext = createContext<AuthContext>(null as any);
const authModule = new AuthModule();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({
  children,
}: JSX.ElementChildrenAttribute): JSX.Element => {
  const auth = useProvideAuth(authModule) as AuthContext;
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = (): AuthContext => useContext(authContext);
