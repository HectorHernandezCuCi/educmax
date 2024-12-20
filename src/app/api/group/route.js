import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, grade, studentCount, teacher, startDate, endDate, notes } =
      data;

    // Validar datos obligatorios
    if (!name || !grade || !studentCount || !teacher) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Convertir las fechas de cadenas a objetos Date
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Crear grupo
    const newGroup = await db.group.create({
      data: {
        name,
        grade,
        studentCount,
        teacher,
        startDate: startDateObj,
        endDate: endDateObj,
        notes,
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error("Error al crear el grupo:", error);
    return NextResponse.json(
      { error: "Error al crear el grupo" },
      { status: 500 }
    );
  }
}
