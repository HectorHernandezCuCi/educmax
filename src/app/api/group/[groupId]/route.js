// app/api/group/[groupId]/route.ts
import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function GET(request, { params }) {
  const { groupId } = params; // Obtén el groupId de la URL

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  try {
    const group = await db.group.findUnique({
      where: { id: groupId }, // Consulta el grupo con ese ID
      include: {
        studentGroups: {
          include: {
            student: true, // Incluye los datos del estudiante
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Grupo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el grupo:", error);
    return NextResponse.json(
      { error: "Error al obtener el grupo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { groupId } = params; // Obtén el groupId de la URL

  if (!groupId) {
    return NextResponse.json({ error: "groupId is required" }, { status: 400 });
  }

  try {
    // Obtener los IDs de los estudiantes que pertenecen al grupo
    const studentGroups = await db.studentGroup.findMany({
      where: { groupId },
      select: { studentId: true },
    });

    const studentIds = studentGroups.map((sg) => sg.studentId);

    // Eliminar las relaciones en StudentGroup
    await db.studentGroup.deleteMany({
      where: { groupId },
    });

    // Eliminar las relaciones en TeacherGroup
    await db.teacherGroup.deleteMany({
      where: { groupId },
    });

    // Eliminar los estudiantes que pertenecen al grupo
    await db.student.deleteMany({
      where: { id: { in: studentIds } },
    });

    // Eliminar el grupo
    await db.group.delete({
      where: { id: groupId },
    });

    return NextResponse.json(
      { message: "Grupo y estudiantes eliminados exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el grupo:", error);
    return NextResponse.json(
      { error: "Error al eliminar el grupo" },
      { status: 500 }
    );
  }
}
