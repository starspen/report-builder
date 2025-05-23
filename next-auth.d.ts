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
      roles? : string[];
      modules? : string[];
      signInMethod?: string | null;
      accessToken?: string | null;
    };
    // idToken: string;
  }
  interface User extends DefaultUser {
    emailVerified?: string | null;
    div_cd?: string | null;
    dept_cd?: string | null;
    role?: string | null;
    roles? : string[];
    modules? : string[];
    password?: string | null;
    accessToken?: string | null;
  }

  // interface User extends DefaultUser, UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string | null;
    // idToken: string;
  }
}
