import { useState } from "react";
import { AuthContext } from "./types";
import { AuthModule } from "./AuthModule";

export const useProvideAuth = (
  auth: AuthModule,
  origin?: string
): AuthContext => {
  const [user, setUser] = useState<string | undefined>(auth?.account?.name);

  auth.onAccount((user?: string) => {
    if (user) setUser(user);
  });

  const signin = async (userPolicyId: string): Promise<void> => {
    sessionStorage.setItem("currentPolicy", userPolicyId || "");
    auth.login(userPolicyId);
  };
  const signout = (): void => {
    auth.logout(process.env.REACT_APP_B2C_LOGIN_POLICY || "");
  };

  const token = async (): Promise<string | null> => {
    try {
      let response = await auth.token();
      return response;
    } catch (ex) {
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
