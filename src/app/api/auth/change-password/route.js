import db from "@/libs/db";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return new Response(JSON.stringify({ error: "Email and new password are required" }), {
      status: 400,
    });
  }

  try {
    // Verificar si el usuario existe
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña del usuario
    await db.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Configurar envío de correo
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Changed Successfully",
      text: `Hello ${user.name},\n\nYour password has been successfully updated.`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Password updated successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
