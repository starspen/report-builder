import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { database } from "@/lib/database";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    if (!database.connected) {
      await database.connect();
    }

    const data = await request.json();

    const currentDate = new Date().toISOString().slice(0, 10);

    // Query ke database
    const result = await database.query(
      `INSERT INTO mgr.m_user (email, password, name, created_by, created_at) VALUES ('${data.userEmail}', '${data.userPassword}', '${data.userName}', 'MGR', '${currentDate}')`
    );

    await database.close();

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Success insert data",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Error submit data:" + error,
        data: [],
      },
      { status: 500 }
    );
  }
}
