import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { userId } = params;

  try {
    const likedPosts = await db.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        user: true,
        likes: true,
      },
    });

    if (!likedPosts.length) {
      return NextResponse.json(
        { error: "Liked posts not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ likedPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json(
      { error: "Error fetching liked posts" },
      { status: 500 }
    );
  }
}
