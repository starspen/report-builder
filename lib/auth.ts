import NextAuth, { Account, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { CustomAdapter } from "./custom-adapter";
import { getUserByEmail } from "./model";
import bcrypt from "bcrypt";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     refreshToken?: string;
//   }

//   interface User {
//     role?: string;
//     accessToken?: string;
//     refreshToken?: string;
//     div_cd:string;
//     dept_cd:string;
//     picture:string;
//     signInMethod:string
//   }
// }

export const { auth, handlers, signIn, signOut } = NextAuth({
  // session: {
  //   strategy: "jwt",
  // },
  // adapter: PrismaAdapter(prisma),
  adapter:CustomAdapter(),
  trustHost: true,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
          redirect_uri:
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback/microsoft-entra-id`,
          tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
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

          if (result.statusCode === 200) {
            const user = {
              id: result.data.id,
              email: result.data.email,
              name: result.data.name,
              role: result.data.role,
              image: result.data.pict,
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
            };

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
    // CredentialsProvider({
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials): Promise<User | null> {
    //     try {
    //       if (!credentials) return null;

    //       const user = await getUserByEmail(credentials.email as string);

    //       if (!user) {
    //         console.error("User not found");
    //         throw new Error("Invalid credentials");
    //       }

    //       const isMatch = await bcrypt.compare(
    //         credentials.password as string,
    //         user.password as string,
    //       );

    //       if (!isMatch) {
    //         console.error("Invalid password");
    //         throw new Error("Invalid credentials");
    //       }
    //       return {
    //         ...user,
    //         password: null,
    //       };
    //     } catch (error) {
    //       if (
    //         error instanceof Error &&
    //         error.message === "Invalid credentials"
    //       ) {
    //         console.error("Authorization error:", error.message);
    //         throw new Error("Invalid credentials"); // Tetap informatif
    //       }

    //       console.error("Server error:", error);
    //       throw new Error("Server error, please try again later."); // General server error
    //     }
    //   },
    // }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account, user, session, trigger }) {
      console.log("user: ", user);
      console.log("account: ", account);
      console.log("token: ", token);
      if (account) {
        token.providerAccountId = account.providerAccountId;
      }
      if (user) {
        token.id = user.id;
        token.div_cd = user.div_cd || null;
        token.dept_cd = user.dept_cd || null;
        token.role = user.role;
        token.image = user.image || null;
        token.signInMethod = account?.provider || null;
        token.accessToken = user.accessToken || null;
        // user.id = user.id;
        // user.div_cd = user.div_cd || null;
        // user.dept_cd = user.dept_cd || null;
        // user.role = user.role || "administrator";
        // user.picture = user.image || null;
        // user.signInMethod = account?.provider || null;
      }
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      console.log("user: ", user);
      console.log("account: ", account);
      console.log("profile: ", profile);
      return true;
    },

    async session({ session, token }): Promise<Session> {
      session.user.id = token.id as string;
      session.user.div_cd = token.div_cd as string | undefined;
      session.user.dept_cd = token.dept_cd as string | undefined;
      session.user.role = token.role as string | undefined;
      session.user.emailVerified = new Date(token.emailVerified as string);
      session.user.signInMethod = token.signInMethod as string | undefined;
      session.user.image = token.image as string || '/default-avatar.png';
      if(token.accessToken !== null){
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  debug: true,
});
