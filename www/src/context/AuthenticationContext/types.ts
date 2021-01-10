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
    token(): Promise<string | null>;
    onToken(cb: Function): void
};

export type { AuthContext, Policy, UserProfile };