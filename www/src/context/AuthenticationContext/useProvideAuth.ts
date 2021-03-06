import { useState } from "react";
import { AuthContext } from "../AuthenticationContext";
import AuthModule from "./AuthModule";

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

  const token = async (): Promise<string | null> => {
    try {
      let response = await auth.token();
      return response || null;
    } catch (ex) {
      console.log("[ERROR]", ex);
      return null;
    }
  };

  return {
    user,
    signin,
    token,
    signout,
  };
};
