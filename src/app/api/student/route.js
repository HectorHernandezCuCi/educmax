import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        { message: "Invalid content type, expected application/json" },
        { status: 400 }
      );
    }

    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { studentName, studentListNumber } = data;

    if (!studentName || !studentListNumber) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const newStudent = await db.student.create({
      data: {
        name: studentName,
        listNumber: studentListNumber,
      },
    });

    return NextResponse.json(
      { message: "Estudiante creado exitosamente", student: newStudent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error al crear el estudiante" },
      { status: 500 }
    );
  }
}
