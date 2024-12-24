import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function POST(request) {
  try {
    const { postId, groupIds } = await request.json();

    if (!postId || !groupIds || !Array.isArray(groupIds)) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post no encontrado" },
        { status: 404 }
      );
    }

    await db.$transaction(
      groupIds.map((groupId) =>
        db.group.update({
          where: { id: groupId },
          data: {
            posts: {
              connect: { id: postId },
            },
          },
        })
      )
    );

    return NextResponse.json({ message: "Post guardado exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error saving post:", error.message);
    return NextResponse.json(
      { error: "Error saving post" },
      { status: 500 }
    );
  }
}
