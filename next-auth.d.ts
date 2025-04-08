import NextAuth from "next-auth";
// import { ExtendedUser } from "@/lib/auth";
import { UserType } from "@/app/api/user/data";
import { DefaultJWT, DefaultUser } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      div_cd?: string;
      dept_cd?: string;
      role?: string;
      emailVerified?: Date;
      image?: string;
      name?: string;
      email?: string;
      signInMethod?: string | null;
    };
    // idToken: string;
  }
  interface User extends DefaultUser {
    emailVerified?: string | null;
    div_cd?: string | null;
    dept_cd?: string | null;
    role?: string | null;
    password?: string | null;
  }

  // interface User extends DefaultUser, UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    // accessToken: string;
    // idToken: string;
  }
}
