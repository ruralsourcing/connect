import { useState, useEffect } from "react";
import { AuthContext } from "../AuthenticationContext";
import AuthModule from "./AuthModule";
import { message } from "antd";

export const useProvideAuth = (auth: AuthModule): AuthContext => {
  const [user, setUser] = useState<string | undefined>(auth?.user?.email);
  let tokenCallback: Function;

  auth.onAccount((user?: string) => {
    setUser(user);
  });

  auth.onToken((token?: string) => {
    tokenCallback && tokenCallback(token);
  })

  const onToken = (cb: Function): void => {
    tokenCallback = cb;
  }


  const signin = async (): Promise<void> => {
    auth.login();
  };
  const signout = (): void => {
    auth.logout();
  };

  const token = async (): Promise<string | null> => {
    try {
      let response = await auth.token();
      console.log("[RESPONSE]", response);
      return response || null;
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
    onToken,
    signout,
  };
};
