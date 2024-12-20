import { NextResponse } from "next/server";
import db from "@/libs/db";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    // Validar el tipo de contenido de la solicitud
    const contentType = request.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        { message: "Invalid content type, expected application/json" },
        { status: 400 }
      );
    }

    // Leer y validar el cuerpo de la solicitud
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { firstname, lastname, email, password, age } = data;

    // Validar campos obligatorios
    if (!firstname || !lastname || !email || !password || !age) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Verificar si el correo ya existe en la base de datos
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await db.user.create({
      data: {
        name: firstname,
        lastname,
        email,
        password: hashedPassword,
        age,
      },
    });

    // Respuesta exitosa
    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    // Manejo de errores genéricos
    return NextResponse.json(
      { message: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
