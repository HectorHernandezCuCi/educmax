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

// New route to fetch liked posts by user
export async function GET_LIKED_POSTS(req, { params }) {
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
