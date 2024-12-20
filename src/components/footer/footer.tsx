import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-greenBG text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y Descripción */}
          <div>
            <h2 className="text-2xl font-bold mb-4">EducMax</h2>
            <p className="text-gray-400">
              Una plataforma diseñada para empoderar a los maestros, ayudándolos
              a compartir recursos educativos, organizar sus clases y mejorar el
              aprendizaje.
            </p>
          </div>
          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="text-gray-400 hover:text-white transition"
                >
                  Recursos
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition"
                >
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          {/* Redes Sociales y Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contáctanos</h3>
            <ul>
              <li className="flex items-center space-x-2">
                <span className="material-icons text-gray-400">email</span>
                <a
                  href="mailto:soporte@educmax.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  soporte@educmax.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-icons text-gray-400">phone</span>
                <span className="text-gray-400">+xx-xxxx-xxxx</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-icons text-gray-400">place</span>
                <span className="text-gray-400">Guadalajara, Jalisco</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="material-icons">instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © 2024 EducMax. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;



