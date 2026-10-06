import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return Response.json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return Response.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { email, name, password, role, active } = body;

    await db.query(
      `UPDATE users
       SET email = ?, name = ?, password_hash = ?, role = ?, active = ?
       WHERE id = ?`,
      [email, name, password, role, active, id]
    );

    return Response.json({
      success: true,
      message: "User berhasil diupdate",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return Response.json({
      success: true,
      message: "User berhasil dihapus",
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}