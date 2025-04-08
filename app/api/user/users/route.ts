import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (session?.user?.role !== "administrator") {
        return NextResponse.json(
          { error: "Unauthorized", message: "You are not authorized to access this resource", success: false },
          { status: 401 }
        );
      }

    // const users = await prisma.user.findMany({
    //   select: {
    //     email: true,
    //     name: true,
    //     image: true,
    //     picture: true,
    //     role: true,
    //     div_cd: true,
    //     dept_cd: true,
    //   },
    // });

    const users = await prisma.$queryRawUnsafe(`
        SELECT * FROM mgr.users
      `)

    return NextResponse.json(users);

  } catch (error) {
    console.log("An error occurred:", error);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: error,
    });
  }
}
