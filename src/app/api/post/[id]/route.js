import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Fetch posts by user ID
    const posts = await db.post.findMany({
      where: { userId: id },
      include: {
        user: true,
        likes: true,
      },
    });

    if (!posts) {
      return NextResponse.json(
        { error: "Posts not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if post exists
    const postExists = await db.post.findUnique({
      where: { id },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Delete likes associated with the post
    await db.like.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await db.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    return NextResponse.json(
      { error: "Error deleting post" },
      { status: 500 }
    );
  }
}
