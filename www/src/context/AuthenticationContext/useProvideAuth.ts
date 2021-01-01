import { useState, useEffect } from "react";
import { AuthContext } from "../AuthenticationContext";
import AuthModule from "./AuthModule";
import { message } from "antd";
import { AuthenticationResult } from "@azure/msal-browser";

export const useProvideAuth = (auth: AuthModule): AuthContext => {
  const [user, setUser] = useState<string | undefined>(auth?.user?.email);

  auth.onAccount((user?: string) => {
    setUser(user);
  });

  const signin = async (): Promise<void> => {
    auth.login();
  };
  const signout = (): void => {
    auth.logout();
  };

  const token = async (): Promise<AuthenticationResult | null> => {
    try {
      let response = await auth.token();
      console.log("[RESPONSE]", response);
      return response;
    } catch (ex) {
      console.log("[ERROR]", ex);
      return null;
    }
  };

  useEffect(() => {
    user && message.success(`Hello, ${user}`);
  }, [user]);

  return {
    user,
    signin,
    token,
    signout,
  };
};
