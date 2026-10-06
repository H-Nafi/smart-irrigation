import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // ==========================================
    // TOTAL KONSUMSI HARI INI
    // ==========================================

    const [todayRows] = await db.query(`
      SELECT
        IFNULL(SUM(volume_used), 0) AS total
      FROM water_consumption
      WHERE DATE(created_at) = CURDATE()
    `);

    // ==========================================
    // TOTAL KONSUMSI 7 HARI TERAKHIR
    // ==========================================

    const [weekRows] = await db.query(`
      SELECT
        IFNULL(SUM(volume_used), 0) AS total
      FROM water_consumption
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // ==========================================
    // RATA-RATA KONSUMSI HARIAN
    // ==========================================

    const [averageRows] = await db.query(`
      SELECT
        IFNULL(AVG(daily_total), 0) AS average
      FROM (
        SELECT
          DATE(created_at) AS consumption_date,
          SUM(volume_used) AS daily_total
        FROM water_consumption
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
      ) AS daily_consumption
    `);

    // ==========================================
    // HISTORY KONSUMSI
    // ==========================================
    // Mengambil data konsumsi berdasarkan
    // waktu pencatatan.
    //
    // Data ini nantinya digunakan oleh
    // Grafik Konsumsi Air.
    // ==========================================

    const [historyRows] = await db.query(`
      SELECT
        id,
        farm_id,
        period_type,
        period_label,
        period_start,
        volume_used,
        created_at
      FROM water_consumption
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY created_at ASC
    `);

    // ==========================================
    // FORMAT DATA
    // ==========================================

    const today =
      Number(todayRows[0]?.total || 0);

    const week =
      Number(weekRows[0]?.total || 0);

    const average =
      Number(averageRows[0]?.average || 0);

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json({
      success: true,

      today: Number(today.toFixed(2)),

      week: Number(week.toFixed(2)),

      average: Number(average.toFixed(2)),

      history: historyRows.map((item) => ({
        id: item.id,

        farm_id: item.farm_id,

        period_type:
          item.period_type,

        period_label:
          item.period_label,

        period_start:
          item.period_start,

        volume_used:
          Number(
            item.volume_used || 0
          ),

        created_at:
          item.created_at,
      })),
    });

  } catch (error) {

    console.error(
      "Water Consumption API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error.message ||
          "Gagal mengambil data konsumsi air",
      },
      {
        status: 500,
      }
    );

  }
}