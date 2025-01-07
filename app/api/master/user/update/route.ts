import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { database } from "@/lib/database";

export async function PUT(request: NextRequest, response: NextResponse) {
  try {
    if (!database.connected) {
      await database.connect();
    }

    const data = await request.json();

    const currentDate = new Date().toISOString().slice(0, 10);

    // Query ke database
    const result = await database.query(
      `UPDATE mgr.m_user SET email = '${data.userEmail}', password = '${data.userPassword}', name = '${data.userName}', updated_by = 'MGR', updated_at = '${currentDate}' WHERE user_id = '${data.userId}'`
    );

    await database.close();

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Success update data",
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
