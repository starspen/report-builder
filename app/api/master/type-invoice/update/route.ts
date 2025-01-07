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
      `UPDATE mgr.m_type_invoice SET type_cd = '${data.typeCd}', type_descs = '${data.typeDescs}', approval_pic = '${data.approvalPic}', updated_by = 'MGR', updated_at = '${currentDate}' WHERE type_id = '${data.typeId}'`
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
