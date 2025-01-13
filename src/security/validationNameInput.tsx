export const validateName = (name: string): string | null => {
  // Verificar si el nombre está vacío
  if (!name || name.trim().length === 0) {
    return "El nombre no puede estar vacío.";
  }

  // Verificar si el nombre contiene solo letras y opcionalmente espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return "El nombre sólo puede contener letras y espacios.";
  }

  // Verificar longitud mínima y máxima (mínimo 2, máximo 50 caracteres)
  if (name.length < 2 || name.length > 50) {
    return "El nombre debe tener entre 2 y 50 caracteres.";
  }

  // Otras validaciones personalizadas (ej. evitar nombres prohibidos)
  const forbiddenNames = ["Admin", "Usuario", "Test"];
  if (forbiddenNames.includes(name)) {
    return "El nombre no está permitido.";
  }

  // Si todas las validaciones pasaron, devolver null (sin error)
  return null;
};
