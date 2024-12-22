import { NextResponse } from "next/server";
import db from "@/libs/db";

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
