export const validatePasswordInput = (password: string): string | null => {
  // Verificar si la contraseña está vacía
  if (!password || password.trim().length === 0) {
    return "La contraseña es obligatoria."; // Mensaje si la contraseña está vacía
  }

  // Verificar longitud mínima y máxima (mínimo 8, máximo 20 caracteres)
  if (password.length < 8 || password.length > 20) {
    return "La contraseña debe tener entre 8 y 20 caracteres."; // Mensaje si la longitud no es válida
  }

  // Verificar si tiene al menos una letra mayúscula
  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return "La contraseña debe contener al menos una letra mayúscula."; // Mensaje si no tiene letra mayúscula
  }

  // Verificar si tiene al menos una letra minúscula
  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    return "La contraseña debe contener al menos una letra minúscula."; // Mensaje si no tiene letra minúscula
  }

  // Verificar si tiene al menos un número
  const hasNumber = /\d/.test(password);
  if (!hasNumber) {
    return "La contraseña debe contener al menos un número."; // Mensaje si no tiene número
  }

  // Verificar si tiene al menos un carácter especial
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialChar) {
    return "La contraseña debe contener al menos un carácter especial (ej. !, @, #, $, etc.)."; // Mensaje si no tiene carácter especial
  }

  return null; // Si todas las validaciones son correctas, devuelve null (sin errores)
};
