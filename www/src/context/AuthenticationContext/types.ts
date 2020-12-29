import { AuthenticationResult } from "@azure/msal-browser";

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
    signin(): void;
    signout(): void;
    token(): Promise<AuthenticationResult | null>;
};

export type { AuthContext, Policy, UserProfile };