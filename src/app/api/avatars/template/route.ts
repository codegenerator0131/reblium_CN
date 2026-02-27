import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { Avatar } from "@/types/type";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { templateUserIds } = await req.json();

    const avatarsArrays = await Promise.all(
      templateUserIds.map((id) =>
        query<Avatar[]>(
          "SELECT id, name, image, avatar, created_at, updated_at FROM Avatars WHERE user_id = ?",
          [id]
        )
      )
    );

    const allAvatars = avatarsArrays.flat();

    return NextResponse.json({ success: true, avatars: allAvatars });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
