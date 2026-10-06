import db from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return Response.json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    const user = rows[0];

    if (user.password_hash !== password) {
      return Response.json({
        success: false,
        message: "Password salah",
      });
    }

    return Response.json({
      success: true,
      message: "Login berhasil",
      user,
    });

  } catch (error) {
  console.error(error);

  return Response.json({
    success: false,
    error: error.stack,
    });
  }
}