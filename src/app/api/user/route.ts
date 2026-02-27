import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/verifyToken";
import { MySQLResult, UserWithRoles } from "@/types/type";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await query<UserWithRoles[]>(
      `
      SELECT 
        u.*,
        ur.id as cur_role_id,
        ur.role_id,
        ur.active_date,
        av.image as profile_picture,
        av.avatar as profile_avatar,
        av.thumbnail as profile_thumbnail,
        r.name as role_name
      FROM Users u
      LEFT JOIN User_Roles ur ON u.id = ur.user_id
      LEFT JOIN Roles r ON ur.role_id = r.id
      LEFT JOIN Avatars av ON u.avatar_id = av.id
      WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await verifyToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, email, avatar_id } = await req.json();

    // Create an object to store only the defined fields
    const updatedFields: { [key: string]: string | null } = {};
    if (name !== undefined) updatedFields.name = name;
    if (bio !== undefined) updatedFields.bio = bio;
    if (email !== undefined) updatedFields.email = email;
    if (avatar_id !== undefined) updatedFields.avatar_id = avatar_id;

    // If no fields to update, return early
    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json({ message: "No fields to update" });
    }

    // Construct the SQL query dynamically based on the fields to update
    const fields = Object.keys(updatedFields);
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updatedFields[field] ?? null);

    const sql = `UPDATE Users SET ${setClause} WHERE id = ?`;
    values.push(userId.toString());

    const result = await query<MySQLResult>(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "User not found", message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      updatedUser: result,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Error processing the request" },
      { status: 500 }
    );
  }
}
