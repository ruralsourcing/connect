import React, { useContext, createContext } from "react";
import { useProvideAuth } from "./useProvideAuth";
import { AuthContext } from "./types";
import { PublicClientApplication, RedirectRequest } from "@azure/msal-browser";
import { MSAL_CONFIG } from "./constants";
/**
 * AuthContext to be passed to any component that depends on user context.
 */

const authContext = createContext<AuthContext>(null as any);
const msal = new PublicClientApplication(MSAL_CONFIG);

const redirectRequest: RedirectRequest = {
  scopes: ["openid", "profile", "email"],
  redirectUri: "B2C_1A_WhiteHatB2CDevSamlAndLocal_PasswordReset",
};
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({
  children,
}: JSX.ElementChildrenAttribute): JSX.Element => {
  const auth = useProvideAuth(msal) as AuthContext;
  if (window.location.hash !== "") {
    msal
      .handleRedirectPromise(window.location.hash)
      .then((response) => {
        if (response) auth.handleResponse(response);
      })
      .catch((err) => {
        console.log(err);
        if (err.errorMessage.indexOf("AADB2C90118") > -1) {
          try {
            // Password reset
            msal.loginRedirect(redirectRequest).then((response) => {
              console.log(response);
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`error: ${e}`);
          }
        }
      });
  }
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = (): AuthContext => useContext(authContext);
