import { useEffect } from "react";
import { AuthContext } from "../AuthenticationContext/types";

export interface User {}

export const useProvideMockAuth = (name?: string): AuthContext => {
  const user = name;

  const signin = async (userPolicyId?: string): Promise<void> => {
    if (userPolicyId)
      sessionStorage.setItem("currentPolicy", userPolicyId || "");
  };

  const signout = (): void => {};

  const token = async (): Promise<string | null> => "123";

  return {
    user,
    signin,
    token,
    signout,
  };
};
