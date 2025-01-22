import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          let url = "";
          if (mode === "sandbox") {
            url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
          } else {
            url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
          }

          const response = await fetch(`${url}/auth/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          const result = await response.json();
          console.log(result);

          if (result.statusCode === 200) {
            const user = {
              id: result.data.user_id,
              email: result.data.email,
              name: result.data.name,
              role: result.data.role,
              image: result.data.pict,
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
            };
            console.log("user in auth.ts", user);

            return user;
          } else {
            console.error("Authorization failed:", result);
            // return null;
            throw new Error(result.message || "Authorization failed");
          }
        } catch (error) {
          console.error("Authorization error:", error);
          // return null;
          throw new Error((error as string) || "Authorization error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
