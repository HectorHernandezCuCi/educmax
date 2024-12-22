import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        profilePicture: true,
        posts: true, // Include user's posts
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
