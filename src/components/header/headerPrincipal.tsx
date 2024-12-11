import educMaxLogo from "@HectorHernandez /src/img/EducMaxLogo.png";
import { RegisterBtn } from "@HectorHernandez /src/components/header/registerBtn";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function HeaderPrincipal() {
  const imagesRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  return (
    <header
      className={`fixed top-0 w-full shadow-lg z-50 transition-colors duration-300 ${
        isScrolled ? "bg-greenBG" : "bg-transparent"
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
              Inicio
            </li>
            <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
              Recursos
            </li>
            <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
              Blog
            </li>
            <li className="hover:text-yellow-300 transition-colors duration-200 cursor-pointer">
              Contacto
            </li>
          </ul>
        </nav>

        {/* Login and SignUp */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-white font-semibold hover:underline">
            Inicia sesión
          </button>
          <RegisterBtn />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
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
    </header>
  );
}
