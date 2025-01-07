import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { database } from "@/lib/database";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    if (!database.connected) {
      await database.connect();
    }

    const { startDate, endDate } = await request.json();

    let query;

    if (!startDate && !endDate) {
      query = `SELECT * FROM mgr.ar_email_inv 
        WHERE process_id != '0' 
        AND year(send_date)*10000+month(send_date)*100+day(send_date) >= null 
      AND year(send_date)*10000+month(send_date)*100+day(send_date) <= null
      AND send_status = 'S'
      AND entity_cd = '01'
      AND project_no = '01'
      ORDER BY send_date DESC`;
    } else {
      query = `SELECT * FROM mgr.ar_email_inv 
        WHERE process_id != '0' 
        AND year(send_date)*10000+month(send_date)*100+day(send_date) >= '${startDate}' 
      AND year(send_date)*10000+month(send_date)*100+day(send_date) <= '${endDate}'
      AND send_status = 'S'
      AND entity_cd = '01'
      AND project_no = '01'
      ORDER BY send_date DESC`;
    }

    const result = await database.query(query);

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
