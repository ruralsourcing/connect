import { AuthenticationResult, AccountInfo } from '@azure/msal-browser';

type Policy = {
    policyId: number;
    url: string;
};

type UserProfile = {
    name: string;
    email: string;
};

type AuthContext = {
    user: string | null;
    //profile: UserProfile;
    //getPolicy(): Promise<void | Policy>;
    signin(): void;
    signout(): void;
    getToken(acct: AccountInfo): Promise<void | AuthenticationResult>;
    handleResponse(response: AuthenticationResult | null): void;
};

export type { AuthContext, Policy, UserProfile };