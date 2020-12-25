import { useState, useEffect } from "react";
import { AuthContext } from "../AuthenticationContext";
import AuthModule from "./AuthModule";
import {  message  } from 'antd';

export const useProvideAuth = (auth: AuthModule): AuthContext => {
  const [user, setUser] = useState<string>(auth?.account?.username || '');

  auth.onAccount((user: string) => {
    setUser(user);
  })

  const signin = async (): Promise<void> => {
    auth.login();
  };
  const signout = (): void => {
    auth.logout();
  };

  useEffect(() => {
    user && message.success(`Hello, ${user}`)
  }, [user])

  return {
    user,
    signin,
    signout,
  };
};
