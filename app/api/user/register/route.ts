import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest, response: any) {
  try {
    const session = await auth();
    if (session?.user?.role !== "administrator") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to access this resource",
          success: false,
        },
        { status: 401 },
      );
    }
    let reqBody = await request.json();

    // const foundUser = await prisma.user.findFirst({
    //   where: {
    //     email: reqBody.email,
    //   },
    // });
    const foundUser = await prisma.$queryRawUnsafe(`
        SELECT * FROM mgr.users WHERE email = '${reqBody.email}'
      `)
  
    if ((Array.isArray(foundUser) && foundUser.length > 0)) {
      return NextResponse.json({
        status: "fail",
        message: "User already exists",
      });
    }
    
    const defaultPassword = await bcrypt.hash("@Btid12345", 10);
    let password = defaultPassword
    
    if (reqBody.password) {
        reqBody.password = await bcrypt.hash(reqBody.password, 10);
        password = reqBody.password
      }

    const id = (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : new Date().getTime().toString());
        
    // const newUser = await prisma.user.create({
    //   data: {
    //     email: reqBody.email,
    //     password: reqBody.password || defaultPassword,
    //     name: reqBody.name || null,
    //     image: reqBody.image || null,
    //     picture: reqBody.picture || null,
    //     emailVerified: new Date(),
    //     role: reqBody.role || "user",
    //     div_cd: reqBody.div_cd || null,
    //     dept_cd: reqBody.dept_cd || null,
    //   },
    // });

    const newUser = await prisma.$executeRaw(Prisma.sql`
        INSERT INTO mgr.users (id, email, password, name, pict, picture, role, div_cd, dept_cd, created_by,
        created_at)
        VALUES
        (${id}, ${reqBody.email}, ${password}, ${reqBody.name}, ${reqBody.image}, 
          ${reqBody.picture}, ${reqBody.role}, ${reqBody.div_cd}, ${reqBody.dept_cd},
          ${session.user.name}, GETDATE()
        )
      `)

    

    return NextResponse.json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (e) {
    console.log("An error occurred:", e);
    return NextResponse.json({
      status: "fail",
      message: "Something went wrong",
      data: e,
    });
  }
}
