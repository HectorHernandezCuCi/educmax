"use client";
import educMaxLogo from "@/img/EducMaxLogo.png";
import { RegisterBtn } from "@/components/header/registerBtn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export function HeaderPrincipal() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const router = useRouter();

  const { data: session, status } = useSession();

  // Función para alternar el estado del menú móvil
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`top-0 w-full shadow-lg z-50 transition-colors duration-300 ${
        isScrolled ? "bg-greenBG" : "bg-greenBG"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div>
          <Image
            className="w-28 h-auto"
            src={educMaxLogo}
            alt="EducMax Logo"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex gap-6 text-white font-semibold">
            <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
              <a href="/">Inicio</a>
            </li>
            {!session ? (
              <>
                <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
                  Recursos
                </li>
                <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
                  Blog
                </li>
                <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
                  Contacto
                </li>
              </>
            ) : (
              <>
                <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
                  <a href="/resources">Recursos</a>
                </li>
                <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
                  <a href="/myGroups">Mis Grupos</a>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Login and SignUp or User Info */}
        <div className="hidden md:flex items-center gap-6">
          {status === "loading" ? (
            <p className="text-white">Loading...</p>
          ) : !session ? (
            // Mostrar botones de login y register si no hay sesión
            <>
              <button className="text-white font-semibold hover:underline">
                <a href="/auth/login">Inicia sesión</a>
              </button>
              <RegisterBtn />
            </>
          ) : (
            // Mostrar nombre del usuario y botón de logout si hay sesión
            <>
              {session.user && (
                <span className="text-white">Hola, {session.user.name}</span>
              )}
              <button
                onClick={() => signOut()}
                className="text-white font-semibold hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu} // Cambiar el estado cuando el usuario haga clic
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-greenBG text-white py-4">
          <a href="/" className="py-2 hover:text-yellow-300">
            Inicio
          </a>
          {!session ? (
            <>
              <a href="/recursos" className="py-2 hover:text-yellow-300">
                Recursos
              </a>
              <a href="/blog" className="py-2 hover:text-yellow-300">
                Blog
              </a>
              <a href="/contacto" className="py-2 hover:text-yellow-300">
                Contacto
              </a>
            </>
          ) : (
            <>
              <a href="/resource" className="py-2 hover:text-yellow-300">
                Recursos
              </a>
              <a href="/myGroups" className="py-2 hover:text-yellow-300">
                Mis Grupos
              </a>
            </>
          )}

          {status === "loading" ? (
            <p className="text-white py-2">Loading...</p>
          ) : !session ? (
            <>
              <a
                href="/auth/login"
                className="py-2 text-white font-semibold hover:underline"
              >
                Inicia sesión
              </a>
              <RegisterBtn />
            </>
          ) : (
            <>
              {session.user && (
                <span className="py-2 text-white">
                  Hola, {session.user.name}
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="py-2 text-white font-semibold hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
