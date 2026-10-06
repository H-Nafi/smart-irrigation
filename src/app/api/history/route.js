import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all"; // 'watering', 'pump', 'waterlevel', 'all'
    const startDate = searchParams.get("startDate"); // YYYY-MM-DD
    const endDate = searchParams.get("endDate");     // YYYY-MM-DD

    let dateFilterSql = "";
    const params = [];

    if (startDate && endDate) {
      dateFilterSql = " AND DATE(created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    } else if (startDate) {
      dateFilterSql = " AND DATE(created_at) >= ?";
      params.push(startDate);
    } else if (endDate) {
      dateFilterSql = " AND DATE(created_at) <= ?";
      params.push(endDate);
    }

    // 1. Water Level History
    let waterLevelSql = `
      SELECT
        id,
        percentage,
        current_volume,
        total_capacity,
        recorded_at AS created_at
      FROM water_level_readings
      WHERE 1=1
    `;
    if (startDate && endDate) {
      waterLevelSql += " AND DATE(recorded_at) BETWEEN ? AND ?";
    } else if (startDate) {
      waterLevelSql += " AND DATE(recorded_at) >= ?";
    } else if (endDate) {
      waterLevelSql += " AND DATE(recorded_at) <= ?";
    }
    waterLevelSql += " ORDER BY recorded_at DESC LIMIT 100";

    const [waterLevelRows] = await db.query(waterLevelSql, params);

    // 2. Water Consumption / Watering Activity History
    let consumptionSql = `
      SELECT
        id,
        farm_id,
        period_type,
        period_label,
        volume_used,
        created_at
      FROM water_consumption
      WHERE 1=1 ${dateFilterSql}
      ORDER BY created_at DESC LIMIT 100
    `;

    const [consumptionRows] = await db.query(consumptionSql, params);

    // Synthesize structured watering sessions from consumption log
    const wateringSessions = consumptionRows.map((row, idx) => {
      const startTime = new Date(row.created_at);
      // Estimate duration: assume ~5 minutes default or calculated
      const estimatedDurationMinutes = Math.max(1, Math.round((Number(row.volume_used) || 1) * 3));
      const stopTime = new Date(startTime.getTime() + estimatedDurationMinutes * 60000);

      return {
        id: row.id,
        start_time: startTime.toISOString(),
        stop_time: stopTime.toISOString(),
        duration_minutes: estimatedDurationMinutes,
        volume_used: Number(row.volume_used || 0).toFixed(2),
        mode: row.period_label || "Timer",
        status: "Completed",
      };
    });

    // 3. Pump Status Logs (Synthesized or queried from system logs)
    const pumpLogs = consumptionRows.flatMap((row) => [
      {
        id: `pump-on-${row.id}`,
        status: "ON",
        timestamp: row.created_at,
        trigger: row.period_label || "Manual / Timer",
      },
      {
        id: `pump-off-${row.id}`,
        status: "OFF",
        timestamp: new Date(new Date(row.created_at).getTime() + 300000).toISOString(),
        trigger: "Timer Expired / Manual Stop",
      },
    ]);

    return NextResponse.json({
      success: true,
      waterLevelHistory: waterLevelRows.map((r) => ({
        id: r.id,
        percentage: Number(r.percentage || 0).toFixed(1),
        current_volume: Number(r.current_volume || 0).toFixed(2),
        total_capacity: Number(r.total_capacity || 1).toFixed(2),
        recorded_at: r.created_at,
      })),
      wateringSessions,
      pumpLogs,
    });
  } catch (error) {
    console.error("GET History API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mengambil data history",
      },
      { status: 500 }
    );
  }
}
