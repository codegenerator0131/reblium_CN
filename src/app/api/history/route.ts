import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const historyData = await query<[]>(
      `
      SELECT *
      FROM User_Action_History
      ORDER BY action_at DESC
      `
    );

    return NextResponse.json({ data: historyData, success: true });
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      { error: "Error processing the request", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, description } = await req.json();

    let result = await query<{ insertId?: number }>(
      "INSERT INTO User_Action_History (user_email, description, action_at) VALUES (?, ?, NOW())",
      [email, description]
    );

    if (result.insertId) {
      return NextResponse.json({
        success: true,
        message: "Added User Action History Successfully.",
      });
    }
    return NextResponse.json({
      success: false,
      message: "Failed to Add User Action History.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
