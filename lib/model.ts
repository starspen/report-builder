import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { User } from "next-auth";

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user:Array<any> = await prisma.$queryRaw(Prisma.sql`
      SELECT * FROM mgr.users WHERE email = ${email}
      `)
    return {
      id: user[0]?.id,
      name: user[0]?.name,
      email: user[0]?.email,
      image: user[0]?.image,
      emailVerified: user[0]?.emailVerified?.toISOString(),
      role: user[0]?.role,
      dept_cd: user[0]?.dept_cd,
      div_cd: user[0]?.div_cd,
      password: user[0]?.password,
    };
  } catch (error) {
    console.error("Database error in getUserByEmail:", error);
    throw new Error("Database connection error");
  }
}
