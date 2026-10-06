import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET HISTORY WATER LEVEL
// =========================
export async function GET(request) {

  try {

    const { searchParams } = new URL(request.url);

    // default 1 jam
    const hours = Number(searchParams.get("hours")) || 1;

    const [rows] = await db.query(
      `
    SELECT
      w.percentage,
      w.current_volume,
      w.recorded_at
    FROM water_level_readings w
    INNER JOIN
    (
      SELECT
          MAX(id) AS id
      FROM water_level_readings
      WHERE recorded_at >= DATE_SUB(NOW(), INTERVAL ? HOUR)
      GROUP BY DATE_FORMAT(recorded_at,'%Y-%m-%d %H:%i')
    ) latest
    ON w.id = latest.id
    ORDER BY w.recorded_at ASC;
      `,
      [hours]
    );

    return NextResponse.json(rows);

  } catch (error) {

    console.log(error);

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

export async function POST(request) {

  try {

    const body = await request.json();

    const { percentage } = body;

    // Ambil kapasitas tandon dari system_settings
    const [setting] = await db.query(
      "SELECT value FROM system_settings WHERE `key`='tank_capacity'"
    );

    const tankCapacity =
      setting.length > 0
        ? parseFloat(setting[0].value)
        : 1.0;

    // Hitung volume air
    const currentVolume =
      (percentage / 100) * tankCapacity;

    // Simpan ke database
    await db.query(
    `
     INSERT INTO water_level_readings
    (
    device_id,
    farm_id,
    total_capacity,
    current_volume,
    percentage,
    recorded_at
  )
  VALUES
  (?, ?, ?, ?, ?, NOW(3))
  `,
      [
        2, //device id
        1, //farm id
        tankCapacity,
        currentVolume,
        percentage,
      ]
    );

    // Ambil 2 data terakhir
    const [lastRows] = await db.query(`
        SELECT current_volume
        FROM water_level_readings
        ORDER BY id DESC
        LIMIT 2
    `);

    if (lastRows.length >= 2) {

  const current = Number(lastRows[0].current_volume);
  const previous = Number(lastRows[1].current_volume);

  // Ambil status pompa
  const [pump] = await db.query(`
    SELECT value
    FROM system_settings
    WHERE \`key\`='pump_status'
  `);

  // Hitung konsumsi hanya jika pompa ON
    if (pump[0].value === "ON") {

  const used = previous - current;

    if (used > 0.01) {

    await db.query(
      `
      INSERT INTO water_consumption
      (
        farm_id,
        period_type,
        period_label,
        period_start,
        volume_used,
        created_at
        )
        VALUES
        (?, ?, ?, NOW(), ?, NOW())
       `,
        [
        1,
        "realtime",
        "Realtime",
         used,
        ]
     );

    }

  }

}
    return NextResponse.json({
      success: true,
      message: "Monitoring berhasil disimpan",
    });

  } catch (error) {

    console.log(error);

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