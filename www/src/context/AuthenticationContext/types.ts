import { AuthenticationResult } from "@azure/msal-browser";
import { User } from "@prisma/client";

type Policy = {
    policyId: number;
    url: string;
};

type UserProfile = {
    name: string;
    email: string;
};

type AuthContext = {
    user?: string;
    signin(): void;
    signout(): void;
    token(): Promise<AuthenticationResult | null>;
};

export type { AuthContext, Policy, UserProfile };