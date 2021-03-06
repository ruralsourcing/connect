import {
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
  PublicClientApplication,
  RedirectRequest,
} from "@azure/msal-browser";
import { User } from "@prisma/client";
import { MSAL_CONFIG, LOGIN_REQUEST } from "./constants";

const POLICY = `${process.env.REACT_APP_B2C_AUTHORITY}/${process.env.REACT_APP_B2C_LOGIN_POLICY}`;
const RESET_POLICY = `${process.env.REACT_APP_B2C_AUTHORITY}/${process.env.REACT_APP_B2C_RESET_POLICY}`;

const redirectRequest: RedirectRequest = {
  scopes: [
    "openid",
    "offline_access",
    process.env.REACT_APP_B2C_SCOPE || "",
  ],
  redirectUri: `${window.location.protocol}//${window.location.host}`,
  authority: RESET_POLICY,
  redirectStartPage: `${window.location.protocol}//${window.location.host}`,
};

class AuthModule {
  msal: PublicClientApplication;
  account?: AccountInfo;
  user?: User;

  private accountCallback?: (user?: string) => void;

  constructor() {
    this.msal = new PublicClientApplication(MSAL_CONFIG);
    this.msal
      .handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        if (response === null) {
          this.msal.getAllAccounts().forEach((acct) => {
            this.account = acct;
            this.accountCallback && this.accountCallback(this.account.username);
          });
        } else {
          if (response?.account) {
            this.account = response?.account;
            this.accountCallback && this.accountCallback(this.account.username);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.errorMessage.indexOf("AADB2C90118") > -1) {
          try {
            // Password reset
            this.msal.loginRedirect(redirectRequest);
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

  onAccount(cb: (user?: string) => void) {
    this.accountCallback = cb;
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

    return this.msal
      .acquireTokenSilent({
        account: this.account,
        ...LOGIN_REQUEST,
      })
      .then((result) => {
        if (!result.accessToken || result.accessToken === "") {
          throw new InteractionRequiredAuthError();
        }
        return result.accessToken;
      })
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return this.msal.acquireTokenRedirect({
            account: this.account,
            ...LOGIN_REQUEST,
          });
        } else {
          console.log(error);
        }
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
