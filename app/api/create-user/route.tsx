import { NextResponse } from "next/server";
import { prisma } from "@HectorHernandez /src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, lastname, email, password, age } =
      await request.json();

    // Validaciones básicas (opcional)
    if (!name || !lastname || !email || !password || !age) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      );
    }

    // Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password, // Nota: ¡nunca guardes contraseñas en texto plano en producción!
        age: parseInt(age),
        profileImage,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
