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
};

export type { AuthContext, Policy, UserProfile };