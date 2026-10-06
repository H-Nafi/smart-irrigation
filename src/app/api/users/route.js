import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM users");

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
export async function POST(request) {
  try {
    const body = await request.json();

    const { email, name, password, role } = body;

    await db.query(
      `INSERT INTO users (email, name, password_hash, role, active)
       VALUES (?, ?, ?, ?, ?)`,
      [email, name, password, role, 1]
    );

    return Response.json({
      success: true,
      message: "User berhasil ditambahkan",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}