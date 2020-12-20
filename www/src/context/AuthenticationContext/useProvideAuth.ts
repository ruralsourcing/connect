import { useState } from "react";
import { AuthContext } from "../AuthenticationContext";
import { useNotifier, NotificationEnum } from "../NotificationContext";
import AuthModule from "./AuthModule";

export const useProvideAuth = (auth: AuthModule): AuthContext => {
  const notifier = useNotifier();
  const [user, setUser] = useState<string>(auth?.account?.username || '');

  auth.onAccount((user: string) => {
    notifier.setNotification({appearance: NotificationEnum.SUCCESS, message: "Logged In!"})
    notifier.setNotification({appearance: NotificationEnum.ERROR, message: "FIRE!!!!!!"})
    setUser(user)
  })

  const signin = async (): Promise<void> => {
    auth.login();
  };
  const signout = (): void => {
    auth.logout();
  };

  return {
    user,
    signin,
    signout,
  };
};
