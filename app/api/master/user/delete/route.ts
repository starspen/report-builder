import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { database } from "@/lib/database";

export async function DELETE(request: NextRequest, response: NextResponse) {
  try {
    if (!database.connected) {
      await database.connect();
    }

    const data = await request.json();

    // Query ke database
    const result = await database.query(
      `DELETE FROM mgr.m_user WHERE user_id = '${data.userId}'`
    );

    await database.close();

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Success delete data",
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
