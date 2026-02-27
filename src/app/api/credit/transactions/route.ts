import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { UserCredit } from "@/types/type";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const getCreditHistory = `
      SELECT * 
      FROM Credit_History 
      WHERE user_id = ? 
      ORDER BY transaction_at DESC
    `;

    const getCreditHistoryQuery = await query<UserCredit[]>(getCreditHistory, [
      userId,
    ]);

    if (getCreditHistoryQuery.length === 0) {
      return NextResponse.json({ success: false });
    } else {
      return NextResponse.json({
        success: true,
        transactions: getCreditHistoryQuery,
      });
    }
  } catch (error) {
    console.error("Error executing database query:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
