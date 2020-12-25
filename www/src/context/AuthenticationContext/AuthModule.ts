import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
  RedirectRequest,
} from "@azure/msal-browser";
import { MSAL_CONFIG, LOGIN_REQUEST } from "./constants";

console.log("ENV", process.env);
const POLICY = `${process.env.REACT_APP_B2C_AUTHORITY}/${process.env.REACT_APP_B2C_LOGIN_POLICY}`;
const RESET_POLICY = `${process.env.REACT_APP_B2C_AUTHORITY}/${process.env.REACT_APP_B2C_RESET_POLICY}`;

const redirectRequest: RedirectRequest = {
  scopes: ["openid", "profile", "email"],
  redirectUri: `${window.location.protocol}//${window.location.host}`,
  authority: RESET_POLICY,
  redirectStartPage: `${window.location.protocol}//${window.location.host}`,
};

class AuthModule {
  msal: PublicClientApplication;
  account?: AccountInfo;

  private cb?: Function;

  constructor() {
    this.msal = new PublicClientApplication(MSAL_CONFIG);
    this.account = this.getActiveAccount();
    this.msal
      .handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        if (response === null) {
          this.msal.getAllAccounts().forEach((acct) => {
            // eslint-disable-next-line no-console
            console.log(acct);
            this.account = acct;
            //setUser(acct.name || "");
            this.cb && this.cb(acct.username);
          });
        } else {
          // eslint-disable-next-line no-console
          console.log(response);
          if (response?.account) {
            this.account = response?.account;
            this.cb && this.cb(response?.account?.username);
          }
          //setUser(response?.account?.name || "");
          //setProfile(getUserProfile(response.account));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.errorMessage.indexOf("AADB2C90118") > -1) {
          try {
            // Password reset
            this.msal.loginRedirect(redirectRequest).then((response) => {
              console.log(response);
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`error: ${e}`);
          }
        }
      });
  }

  onAccount(cb: Function) {
    this.cb = cb;
  }

  login() {
    this.msal
      .loginRedirect({
        ...LOGIN_REQUEST,
        ...{
          authority: POLICY,
          redirectUri: `${window.location.protocol}//${window.location.host}`,
        },
      })
      .catch((ex) => {
        console.log(ex);
        this.msal
          .loginPopup({
            ...LOGIN_REQUEST,
            ...{
              authority: POLICY,
              redirectUri: `${window.location.protocol}//${window.location.host}`,
            },
          })
          .catch((e) => {
            console.log(e);
          });
      });
  }

  logout() {
    this.msal.logout({
      postLogoutRedirectUri: `${window.location.protocol}//${window.location.host}`,
      authority: POLICY,
    });
  }

  getActiveAccount() {
    if (this.msal.getAllAccounts().length > 0) {
      return this.msal.getAllAccounts()[0];
    }
    return;
  }
}

export default AuthModule;

// const getToken = async (
//     acct: AccountInfo
//   ): Promise<AuthenticationResult | void> => {
//     const request: SilentRequest = {
//       scopes: ["openid", "profile", "email"],
//       forceRefresh: false,
//       account: acct,
//     };
//     try {
//       return auth.msal.acquireTokenSilent(request).catch(async (ex) => {
//         notifier.setNotification({
//           message: `Cannot silently refresh token, trying with a popup... ${ex}`,
//           appearance: NotificationEnum.ERROR,
//         });
//         return auth.msal.acquireTokenPopup(request).catch((e) => {
//           notifier.setNotification({
//             message: `Acquiring token via popup also failed, you'll have to log in manually. ${e}`,
//             appearance: NotificationEnum.ERROR,
//           });
//         });
//       });
//     } catch (ex) {
//       notifier.setNotification({
//         message: `Token request failed: ${ex}`,
//         appearance: NotificationEnum.ERROR,
//       });
//     }
//   };
