import { useState } from "react";
import {
  PublicClientApplication,
  SilentRequest,
  RedirectRequest,
  AccountInfo,
  AuthenticationResult,
} from "@azure/msal-browser";
import { AuthContext, UserProfile } from "../AuthenticationContext";
import { useNotifier, NotificationEnum } from "../NotificationContext";
import { LOGIN_REQUEST, MSAL_CONFIG } from "./constants";
import { Policy } from "./types";

// const msal = new Msal.UserAgentApplication(MSAL_CONFIG);
// const msal = new PublicClientApplication(MSAL_CONFIG);



const getUserProfile = (account: AccountInfo | null) => {
  if (account) {
    return { name: account.name, email: account.username };
  }
  return null;
};
const getActiveAccount = (msal: PublicClientApplication) => {
  if (msal.getAllAccounts().length > 0) {
    return msal.getAllAccounts()[0];
  }
  return null;
};

export const useProvideAuth = (msal: PublicClientApplication): AuthContext => {
  const notifier = useNotifier();
  const [currentPolicy, setCurrentPolicy] = useState(
    localStorage.getItem("currentPolicy") || null
  );
  const account = getActiveAccount(msal);
  const [user, setUser] = useState((account && account.name) || null);
  // const [profile, setProfile] = useState<UserProfile>(
  //   account && getUserProfile(account)
  // );

  const getToken = async (
    acct: AccountInfo
  ): Promise<AuthenticationResult | void> => {
    const request: SilentRequest = {
      scopes: ["openid", "profile", "email"],
      forceRefresh: false,
      account: acct
    };
    try {
      return msal.acquireTokenSilent(request).catch(async (ex) => {
        notifier.setNotification({
          message: `Cannot silently refresh token, trying with a popup... ${ex}`,
          appearance: NotificationEnum.ERROR,
        });
        return msal.acquireTokenPopup(request).catch((e) => {
          notifier.setNotification({
            message: `Acquiring token via popup also failed, you'll have to log in manually. ${e}`,
            appearance: NotificationEnum.ERROR,
          });
        });
      });
    } catch (ex) {
      notifier.setNotification({
        message: `Token request failed: ${ex}`,
        appearance: NotificationEnum.ERROR,
      });
    }
  };

  // signin and acquire a token silently with POPUP flow. Fall back in case of failure with silent acquisition to popup
  const signin = async (): Promise<void> => {
    let policy = 'https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com/B2C_1_CASpR';
    if (policy) {
      // auth is equal to await call for authority in root server
      msal.loginRedirect({
        ...LOGIN_REQUEST,
        ...{
          authority: policy,
          redirectUri: 'http://localhost',
        },
      });
    }
  };
  const signout = (): void => {
    window.location.href = `https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com/${currentPolicy}/oauth2/v2.0/logout?post_logout_redirect_uri=${window.location.protocol}//${window.location.host}`;
    localStorage.clear();
  };
  const handleResponse = (response: AuthenticationResult | null) => {
    if (response === null) {
      msal.getAllAccounts().forEach((acct) => {
        // eslint-disable-next-line no-console
        console.log(acct);
        setUser(acct.name || "");
      });
    } else {
      // eslint-disable-next-line no-console
      console.log(response);
      setUser(response?.account?.name || "");
      //setProfile(getUserProfile(response.account));
    }
  };
  return {
    user,
    //profile,
    //getPolicy,
    signin,
    signout,
    getToken,
    handleResponse,
  };
};
