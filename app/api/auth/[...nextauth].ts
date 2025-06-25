import { CustomAdapter } from "@/lib/custom-adapter";
import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export default NextAuth({
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
    ],
  // Your callbacks, session, etc.
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
        token.roles = user.roles || null;
        token.modules = user.modules || null;
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

    async session({ session, token }): Promise<any> {
      session.user.id = token.id as string;
      session.user.div_cd = token.div_cd as string | undefined;
      session.user.dept_cd = token.dept_cd as string | undefined;
      session.user.role = token.role as string | undefined;
      session.user.roles = token.roles as string[] | undefined;
      session.user.modules = token.modules as string[] | undefined;
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
  
