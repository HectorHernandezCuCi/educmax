import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function POST(request, { params }) {
  try {
    const { id } = params; // Ensure this matches the dynamic path parameter used in other routes
    const { content } = await request.json();

    // Create a new comment
    const newComment = await db.comment.create({
      data: {
        content,
        postId: id,
        userId: "currentUserId", // Replace with the actual user ID
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    return NextResponse.json(
      { error: "Error creating comment" },
      { status: 500 }
    );
  }
}
