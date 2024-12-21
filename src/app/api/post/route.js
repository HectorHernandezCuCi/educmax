import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const userId = formData.get("userId");

    // Validate data
    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: "Olvidaste llenar todos los campos" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Create a new post
    const newPost = await db.post.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json(
      { error: "Error creating post" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: true, // Include likes relation
        _count: {
          select: { likes: true },
        },
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { postId, userId } = body;

    // Validate data
    if (!postId || !userId) {
      return NextResponse.json(
        { error: "Faltan datos necesarios" },
        { status: 400 }
      );
    }

    // Check if post exists
    const postExists = await db.post.findUnique({
      where: { id: postId },
    });

    if (!postExists) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Check if the user has already liked the post
    const likeExists = await db.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });

    if (likeExists) {
      // Remove the like
      await db.like.delete({
        where: {
          userId_postId: {
            postId,
            userId,
          },
        },
      });
      return NextResponse.json({ message: "Like removed" }, { status: 200 });
    } else {
      // Create a new like
      const newLike = await db.like.create({
        data: {
          postId,
          userId,
        },
      });
      return NextResponse.json(newLike, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating likes:", error.message);
    return NextResponse.json(
      { error: "Error updating likes" },
      { status: 500 }
    );
  }
}