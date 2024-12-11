export const validateAgeInput = (age: number): string | null => {
  // Check if the age is not provided or invalid
  if (age === null || age === undefined || isNaN(age)) {
    return "La edad es obligatoria.";
  }

  // Check if the age is below 18
  if (age < 18) {
    return "Debes ser mayor de edad para crear una cuenta.";
  }

  // Return null if all validations pass
  return null;
};
