type Policy = {
    policyId: number;
    url: string;
  };
  
  type UserProfile = {
    name: string;
    email: string;
  };
  
  type AuthContext = {
    user: string | undefined;
    signin(userPolicyId?: string): void;
    signout(): void;
    token(): Promise<string | null>;
  };
  
  export type { AuthContext, Policy, UserProfile };