import { NextResponse } from "next/server";
import db from "@/libs/db";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const userId = formData.get("userId");
    const file = formData.get("file");

    let filePath = null;
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "video/mp4"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Solo se permiten archivos PDF, imágenes y videos." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true }); // Ensure the directory exists
      const fullPath = path.join(uploadDir, fileName);
      await fs.writeFile(fullPath, buffer);
      filePath = `/uploads/${fileName}`;
    }

    const post = await db.post.create({
      data: {
        title,
        content,
        userId,
        filePath,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
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

// New route to fetch liked posts by user
export async function GET_LIKED_POSTS(request, { params }) {
  try {
    const { userId } = params;

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

    if (!likedPosts) {
      return NextResponse.json(
        { error: "Liked posts not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ likedPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked posts:", error.message);
    return NextResponse.json(
      { error: "Error fetching liked posts" },
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