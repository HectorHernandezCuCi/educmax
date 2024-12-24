import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Es necesario ingresa el correo y la contraseña.");
        }

        // Buscar usuario en la base de datos
        const userFound = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            age: true,
            profilePicture: true, // Asegúrate de seleccionar la URL de la imagen de perfil
            password: true,
          },
        });

        if (!userFound) {
          throw new Error("Correo o contraseña incorrectos.");
        }

        // Validar contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!isPasswordValid) {
          throw new Error("Correo o contraseña son incorrectos.");
        }

        // Devolver datos del usuario
        console.log("User found:", userFound); // Verificar los datos del usuario encontrado
        return {
          id: userFound.id,
          name: `${userFound.name} ${userFound.lastname}`,
          email: userFound.email,
          age: userFound.age,
          profilePicture: userFound.profilePicture, // Agregar la URL de la imagen de perfil
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Página personalizada para el login
    error: "/auth/error", // Página personalizada para errores de login
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.profilePicture = user.profilePicture; // Agregar la URL de la imagen de perfil
        console.log("JWT token:", token); // Verificar el token JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.profilePicture = token.profilePicture; // Agregar la URL de la imagen de perfil
        console.log("Session user:", session.user); // Verificar el usuario de la sesión
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Usa JWT para gestionar la sesión
    maxAge: 30 * 24 * 60 * 60, // Duración de la sesión: 30 días
  },
  secret: process.env.NEXTAUTH_SECRET, // Clave secreta para JWT
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
