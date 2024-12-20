import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null; // Usuario no autenticado
  }
  return session.user; // Devuelve los datos del usuario autenticado
}
