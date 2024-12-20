import { NextResponse } from "next/server";
import db from "@/libs/db";
import { getSessionUser } from "@/utils/auth";

export async function POST(request) {
  try {
    // Obtener los datos de la solicitud
    const data = await request.json();
    console.log("Received data:", data); // Debugging

    const { userId, groupId } = data;

    if (!userId || !groupId) {
      console.error("Missing userId or groupId:", { userId, groupId }); // Detailed logging
      return NextResponse.json(
        { error: "userId and groupId are required" },
        { status: 400 }
      );
    }

    console.log(
      "Creating TeacherGroup with userId:",
      userId,
      "and groupId:",
      groupId
    ); // Debugging

    // Crear una relación TeacherGroup
    const teacherGroup = await db.teacherGroup.create({
      data: {
        userId,
        groupId,
      },
    });

    // Devuelve la respuesta con la relación creada
    return NextResponse.json(teacherGroup, { status: 201 });
  } catch (error) {
    console.error("Error in creating TeacherGroup:", error); // Mejor manejo del error
    return NextResponse.json(
      { error: "Failed to assign teacher to group" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const groups = await db.teacherGroup.findMany({
      where: { userId: user.id },
      include: { group: true },
    });

    const groupDetails = groups.map((tg) => ({
      id: tg.group.id,
      name: tg.group.name,
    }));

    return NextResponse.json({ groups: groupDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}