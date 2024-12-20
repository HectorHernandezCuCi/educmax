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