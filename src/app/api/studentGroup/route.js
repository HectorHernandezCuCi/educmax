import { NextResponse } from "next/server";
import db from "@/libs/db";
import { getSessionUser } from "@/utils/auth";

export async function POST(request) {
  try {
    // Obtener los datos de la solicitud
    const data = await request.json();
    console.log("Received data:", data); // Debugging

    const { studentId, groupId } = data;

    if (!studentId || !groupId) {
      console.error("Missing studentId or groupId:", { studentId, groupId }); // Detailed logging
      return NextResponse.json(
        { error: "studentId and groupId are required" },
        { status: 400 }
      );
    }

    console.log(
      "Creating StudentGroup with studentId:",
      studentId,
      "and groupId:",
      groupId
    ); // Debugging

    // Crear una relación StudentGroup
    const studentGroup = await db.studentGroup.create({
      data: {
        studentId,
        groupId,
      },
    });

    // Devuelve la respuesta con la relación creada
    return NextResponse.json(studentGroup, { status: 201 });
  } catch (error) {
    console.error("Error in creating StudentGroup:", error); // Mejor manejo del error
    return NextResponse.json(
      { error: "Failed to assign student to group" },
      { status: 500 }
    );
  }
}
