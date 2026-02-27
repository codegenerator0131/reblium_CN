import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();
    const userDeleteQuery = `DELETE FROM Users WHERE email = ?`;
    await query(userDeleteQuery, [email]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
