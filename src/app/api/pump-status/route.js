import { NextResponse } from "next/server";
import db from "@/lib/db";

// =====================================
// GET PUMP STATUS
// =====================================
export async function GET() {
  try {

    const [rows] = await db.query(
      `
      SELECT value
      FROM system_settings
      WHERE \`key\` = 'pump_status'
      LIMIT 1
      `
    );

    // Jika data ditemukan
    if (rows.length > 0) {

      return NextResponse.json({
        success: true,
        status: rows[0].value,
      });

    }

    // Jika pump_status belum ada
    return NextResponse.json({
      success: true,
      status: "OFF",
    });

  } catch (error) {

    console.log("GET Pump Status Error:", error);

    return NextResponse.json(
      {
        success: false,
        status: "OFF",
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}


// =====================================
// POST PUMP STATUS
// =====================================
export async function POST(request) {
  try {

    const { status } = await request.json();

    console.log("Status diterima:", status);

    const [result] = await db.query(
      `
      UPDATE system_settings
      SET value = ?
      WHERE \`key\` = 'pump_status'
      `,
      [status]
    );

    console.log("Database update:", result);

    return NextResponse.json({
      success: true,
      status: status,
    });

  } catch (error) {

    console.log("POST Pump Status Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }
}