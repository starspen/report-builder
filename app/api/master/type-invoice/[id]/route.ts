import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { database } from "@/lib/database";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    if (!database.connected) {
      await database.connect();
    }

    const id = request.nextUrl.searchParams.get("type_id");

    // Query ke database
    const result = await database.query(
      `SELECT * FROM mgr.m_type_invoice WHERE type_id = ${id}`
    );

    await database.close();

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Success",
        data: result.recordset,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Error fetching data:" + error,
        data: [],
      },
      { status: 500 }
    );
  }
}
