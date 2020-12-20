import {Configuration, LogLevel} from '@azure/msal-browser';

export const MSAL_CONFIG: Configuration = {
    auth: {
        clientId: '2b08acb3-4c70-4b1f-8925-b00158883f1a', // This is your client ID
        authority: 'https://codeflyb2c.b2clogin.com/codeflyb2c.onmicrosoft.com/B2C_1_CASpR',
        redirectUri: `${window.location.protocol}//${window.location.host}`,
        postLogoutRedirectUri: `${window.location.protocol}//${window.location.host}`,
        navigateToLoginRequestUrl: true,
        knownAuthorities: ['codeflyb2c.b2clogin.com'],
        cloudDiscoveryMetadata: '',
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {	
                    return;	
                }	
                switch (level) {	
                    case LogLevel.Error:	
                        console.error(message);	
                        return;	
                    case LogLevel.Info:	
                        console.info(message);	
                        return;	
                    case LogLevel.Verbose:	
                        console.debug(message);	
                        return;	
                    case LogLevel.Warning:	
                        console.warn(message);	
                        return;	
                }
            }
        }
    }
};

// request to signin - returns an idToken
export const LOGIN_REQUEST = {
    scopes: ['openid', 'profile', 'email'],
};