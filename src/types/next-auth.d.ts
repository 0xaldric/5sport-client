import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    backendUser?: {
      id: string;
      email: string;
      displayName?: string;
      role: string;
      avatarUrl?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleIdToken?: string;
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      displayName?: string;
      role: string;
      avatarUrl?: string;
    };
  }
}
