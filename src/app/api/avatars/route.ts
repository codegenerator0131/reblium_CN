// File: app/api/avatars/route.ts

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { Avatar } from "@/types/type";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const avatars = await query<Avatar[]>(
      "SELECT id, name, image, avatar, created_at, is_public, updated_at, thumbnail FROM Avatars WHERE user_id = ?",
      [userId]
    );

    const subscribers = await query<Avatar[]>(
      "SELECT * FROM User_Subscribers WHERE origin_user_id = ?",
      [userId]
    );

    return NextResponse.json({ success: true, avatars, subscribers });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { avatarName } = await req.json();
    const addAvatarQuery =
      "INSERT INTO Avatars (name, user_id, is_public, created_at) VALUES (?, ?, 1, NOW())";
    const result = await query<{ insertId: number }>(addAvatarQuery, [
      avatarName,
      userId,
    ]);

    return NextResponse.json({ success: true, insertedId: result.insertId });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, image, avatar, rename, isPublic,thumbnail } = await req.json();

    let result;

    const updates: string[] = [];
    const values: any[] = [];
    if (image !== null && image !== undefined && image !== "") {
      updates.push("image = ?");
      values.push(image);
    }

    if (avatar !== null && avatar !== undefined && avatar !== "") {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (rename !== null && rename !== undefined && rename !== "") {
      updates.push("name = ?");
      values.push(rename);
    }

    if (thumbnail !== null && thumbnail !== undefined && thumbnail !== "") {
      updates.push("thumbnail = ?");
      values.push(thumbnail);
    }

    if (isPublic !== null && isPublic !== undefined && isPublic !== "") {
      updates.push("is_public = ?");
      values.push(isPublic === true ? 1 : 0);
    }

    // Only update if there are fields to update
    if (updates.length > 0) {
      updates.push("updated_at = ?");
      values.push(new Date());

      values.push(id);

      const updateQuery = `
          UPDATE Avatars 
          SET ${updates.join(", ")}
          WHERE id = ?
        `;

      result = await query(updateQuery, values);

      if (result.affectedRows === 0) {
        return NextResponse.json(
          {
            error: "Avatar not found or you don't have permission to update it",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Avatar Data updated successfully",
      });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const deleteAvatarInteractionQuery =
      "DELETE FROM User_Interactions WHERE avatar_id = ?";
    await query(deleteAvatarInteractionQuery, [id]);

    const deleteAvatarQuery = "DELETE FROM Avatars WHERE id = ?";
    await query(deleteAvatarQuery, [id]);

    await query<Avatar[]>(
      `UPDATE Users SET avatar_id = ${null} WHERE id = ? AND avatar_id = ?`,
      [userId, id]
    );

    // Return success response
    return NextResponse.json({
      message: "Avatar deleted successfully!",
      success: true,
    });
  } catch (error) {
    console.error("Error executing database query:", error);
    return NextResponse.json(
      { error: "Error processing the request", details: error.message },
      { status: 500 }
    );
  }
}
