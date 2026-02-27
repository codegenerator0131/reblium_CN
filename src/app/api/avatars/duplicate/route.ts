// app/api/avatars/duplicate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import { query } from "@/lib/db";
import { Avatar } from "@/types/type";

export async function POST(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarId } = await req.json();

    // First, get the original avatar's data
    const getAvatarQuery = `
      SELECT name, image, avatar, user_id
      FROM Avatars 
      WHERE id = ? AND user_id = ?
    `;
    const originalAvatar = await query(getAvatarQuery, [avatarId, userId]);

    if (!originalAvatar) {
      return NextResponse.json(
        { error: "Avatar not found or unauthorized" },
        { status: 404 }
      );
    }

    // Create a new name for the duplicated avatar
    const duplicatedName = `${originalAvatar[0].name} (Copy)`;

    // Insert the duplicated avatar with the copied data
    const duplicateAvatarQuery = `
      INSERT INTO Avatars (
        name,
        image,
        avatar,
        user_id,
        created_at,
        is_public
      ) 
      VALUES (?, ?, ?, ?, NOW(), 0)
    `;

    const result = await query<{ insertId: number }>(duplicateAvatarQuery, [
      duplicatedName,
      originalAvatar[0].image,
      originalAvatar[0].avatar,
      userId,
    ]);

    // Get the chat settings for the original avatar
    const getChatSettingsQuery = `
      SELECT prompts, welcome_message, logo, tags, description
      FROM User_Chat_Setting
      WHERE avatar_id = ?
    `;
    const originalChatSettings = await query<Avatar[]>(getChatSettingsQuery, [
      avatarId,
    ]);

    if (originalChatSettings.length > 0) {
      // Insert the duplicated chat settings
      const duplicateChatSettingsQuery = `
        INSERT INTO User_Chat_Setting (
          avatar_id,
          prompts,
          welcome_message,
          logo,
          tags,
          description,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      await query(duplicateChatSettingsQuery, [
        result.insertId,
        originalChatSettings[0].prompts,
        originalChatSettings[0].welcome_message,
        originalChatSettings[0].logo,
        originalChatSettings[0].tags,
        originalChatSettings[0].description,
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Duplicate Avatar Successfully!",
      insertedId: result.insertId,
      name: duplicatedName,
      image: originalAvatar[0].image,
      avatar: originalAvatar[0].avatar,
      created_at: new Date(),
    });
  } catch (error) {
    console.error("Error duplicating avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
