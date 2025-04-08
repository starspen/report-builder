import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    // Cek apakah user adalah admin
    if (session?.user?.role !== "administrator") {
      return NextResponse.json(
        {
          status: "fail",
          message: "Unauthorized: Only admin can update users",
        },
        { status: 401 }
      );
    }

    const reqBody = await request.json();
    const { email, name, role, div_cd, dept_cd } = reqBody;

    // Cek apakah user yang akan diupdate ada
    const existingUser = await prisma.$queryRawUnsafe(`SELECT * FROM mgr.users WHERE email = '${email}'`)

    if (!existingUser) {
      return NextResponse.json(
        {
          status: "fail",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Update user data
    // const updatedUser = await prisma.$executeRaw(Prisma.sql`
    //   UPDATE mgr.users SET 
    //   `)
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        role,
        div_cd: role === "administrator" ? null : div_cd,
        dept_cd: role === "administrator" ? null : dept_cd,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        status: "fail",
        message: "Failed to update user",
        error: error,
      },
      { status: 500 }
    );
  }
}