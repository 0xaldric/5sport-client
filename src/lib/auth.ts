import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // On initial sign-in, store the Google ID token
      if (account?.id_token) {
        token.googleIdToken = account.id_token;

        // Call backend to exchange Google token for our JWT
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google/authenticate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: account.id_token }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            // Backend returns { status, data: { user, token } } (envelope)
            const payload = data?.data ?? data;
            token.accessToken = payload.token;
            token.user = payload.user;
          }
        } catch {
          // Auth failed - token won't have accessToken
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (token.user) {
        session.backendUser = token.user as {
          id: string;
          email: string;
          displayName?: string;
          role: string;
          avatarUrl?: string;
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // We use a modal, so redirect to home
  },
  session: {
    strategy: "jwt",
  },
};
