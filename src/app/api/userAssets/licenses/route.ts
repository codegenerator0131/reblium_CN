// api/userAssets/licenses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";

export const dynamic = "force-dynamic";

interface UserAssetLicense {
  asset_id: number;
  asset_name: string;
  asset_artist_name: string;
  asset_url: string;
  license_type: string;
  purchase_date: string;
  is_pack: number;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await query<UserAssetLicense[]>(
      `
      SELECT 
        ua.asset_id,
        a.name as asset_name,
        a.artist_name as asset_artist_name,
        a.url as asset_url,
        ua.license_type,
        ua.purchase_date,
        a.is_pack
      FROM User_Assets ua
      JOIN Assets a ON ua.asset_id = a.id
      WHERE ua.user_id = ?
      AND a.is_default = 0
      ORDER BY ua.purchase_date DESC
      `,
      [userId]
    );

    console.log(`User ${userId} has ${rows.length} licensed assets`);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching user licenses:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
