"use client";
import educMaxLogo from "@HectorHernandez /src/img/EducMaxLogo.png";
import { RegisterBtn } from "@HectorHernandez /src/components/header/registerBtn";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@HectorHernandez /src/components/register/photoUpload";
/* Validation import */
import { validateAgeInput } from "@HectorHernandez /src/security/validationAgeInput";
import { validateName } from "@HectorHernandez /src/security/validationNameInput";
import { validateEmail } from "@HectorHernandez /src/security/validationEmailInput";
import { validatePasswordInput } from "@HectorHernandez /src/security/validationPasswordInput";
validatePasswordInput;

export default function Register() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("18");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    image?: string;
    age?: string;
  }>({});

  const router = useRouter();

  const handleImageChange = (image: string | null) => {
    setProfileImage(image);
  };

  const handleSubmitClick = async () => {
    const newErrors: { [key: string]: string } = {};

    const nameError = validateName(name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const lastnameError = validateName(lastname);
    if (lastnameError) {
      newErrors.lastname = lastnameError;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePasswordInput(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const confirmPasswordError =
      password === confirmPassword ? null : "Las contraseñas no coinciden.";
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }

    const ageError = validateAgeInput(age);
    if (ageError) {
      newErrors.age = ageError;
    }

    // Si hay errores, mostramos una alerta y no continuamos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastname,
          email,
          password,
          age,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({
          general: errorData.error || "Error al registrar el usuario",
        });
        return;
      }

      const data = await response.json();
      setSuccessMessage(`Usuario registrado: ${data.name}`);
      router.push("/"); // Redirigir a la página de inicio
    } catch (error) {
      console.error(error);
      setErrors({ general: "Error al registrar el usuario" });
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-greenBG">
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
          {/* Login and Register */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-white font-semibold hover:underline">
              Inicia sesión
            </button>
            <RegisterBtn />
          </div>
        </div>
      </header>
      {/* Main Section */}
      <main className="flex-grow bg-[url('/BgRegister.png')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative flex justify-center items-center h-full">
          <div className="w-full max-w-lg  bg-[#445b50] rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-white text-center mb-8">
              Crear una Cuenta
            </h1>
            <div className="w-full bg-white rounded-md shadow-md p-6">
              <form>
                {/* Upload Photo */}
                <PhotoUpload onImageChange={handleImageChange} />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {/* Name and Lastname */}
                {/* First Name */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastname}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="password"
                      placeholder="Confirmar Contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-gray-200 rounded-lg px-4 py-3">
                    <input
                      type="number"
                      placeholder="Edad"
                      min="18"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitClick();
                  }}
                  className="w-full py-3 mt-6 text-white font-semibold bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600 transition-all"
                >
                  Registrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
