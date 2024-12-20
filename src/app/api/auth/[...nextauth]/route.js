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
          throw new Error("Email and password are required.");
        }

        // Buscar usuario en la base de datos
        const userFound = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!userFound) {
          throw new Error("No user found with this email.");
        }

        // Validar contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Devolver datos del usuario
        return {
          id: userFound.id,
          name: `${userFound.name} ${userFound.lastname}`,
          email: userFound.email,
          age: userFound.age,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
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
