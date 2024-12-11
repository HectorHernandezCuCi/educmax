export const validateEmail = (email: string): string | null => {
  // 1. Verificar si el campo está vacío o contiene solo espacios en blanco
  if (!email.trim()) {
    return "El correo electrónico es obligatorio."; // Mensaje cuando el campo está vacío
  }

  // 2. Expresión regular para validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Si el formato no es válido, devolver el mensaje correspondiente
  if (!emailRegex.test(email)) {
    return "El formato del correo electrónico es inválido. Asegúrate de que tenga el formato correcto (ejemplo@dominio.com)."; // Mensaje cuando el formato es incorrecto
  }

  // Si todas las validaciones son correctas, devolver null (sin errores)
  return null;
};
