interface UserProfile {
    name: string;
    email: string;
};

interface AuthContext {
    user?: string;
    profile?: UserProfile;
    signin(): void;
    signout(): void;
    getToken(): any;
};

export type { AuthContext, UserProfile };
