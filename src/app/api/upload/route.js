// src/app/api/upload/route.js
import cloudinary from "@/libs/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { file } = await req.json();

  console.log("Received file:", file); // Verificar que el archivo se recibe

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "uploads",
    });

    console.log("Upload result:", result); // Verificar el resultado de la subida

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Error uploading image" }, { status: 500 });
  }
}
