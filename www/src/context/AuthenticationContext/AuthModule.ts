import {
  AccountInfo,
  AuthenticationResult,
  PublicClientApplication,
  RedirectRequest,
} from "@azure/msal-browser";
import { User } from "@prisma/client";
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
  user?: User;

  private cb?: ( user?: string ) => void;

  constructor() {
    this.msal = new PublicClientApplication(MSAL_CONFIG);
    this.account = this.getActiveAccount();
    this.msal
      .handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        console.log("[HANDLE REDIRECT]", response);
        if (response === null) {
          this.msal.getAllAccounts().forEach((acct) => {
            this.account = acct;
            this.user = {
              id: 0,
              email: this.account.username,
              domain: ''
            }
            this.cb && this.cb(this.account.username);
          });
        } else {
          if (response?.account) {
            this.account = response?.account;
            this.user = {
              id: 0,
              email: this.account.username,
              domain: ''
            }
            this.cb && this.cb(this.account.username);
          }
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
        if (err.errorMessage.indexOf("AADB2C90077") > -1) {
          try {
            // Password reset
            // this.msal.loginRedirect(redirectRequest).then((response) => {
            //   console.log(response);
            // });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(`error: ${e}`);
          }
        }
      });
  }

  onAccount(cb: ( user?: string ) => void) {
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

  async token() {
    if (!this.account) return null;
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-acquire-cache-tokens#recommended-call-pattern-for-public-client-applications
    // Auth Code Flow might require another way to get cache.
    // Currently all token requests hit B2C and never pulls from cache
    try {
      const result = await this.msal.acquireTokenSilent({
        account: this.account,
        scopes: [],
        forceRefresh: false,
      });
      return result;
    } catch (ex) {
      console.log("[REFRESH]");
      console.log(ex);
      await this.msal.acquireTokenRedirect({
        account: this.account,
        ...LOGIN_REQUEST,
      });
      return null;
    }
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
