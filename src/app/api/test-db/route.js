import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    return Response.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}