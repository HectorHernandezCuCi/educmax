"use client";
import educMaxLogo from "@/img/EducMaxLogo.png";
import { RegisterBtn } from "@/components/header/registerBtn";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/register/photoUpload";
import { useForm } from "react-hook-form";
import cameraIcon from "@/img/cameraIcon.svg";
import worm from "@/img/worm.png";
import book from "@/img/book.png";
import diploma from "@/img/diploma.png";
import dragon from "@/img/dragon.png";
import reading from "@/img/reading.png";
import DOMPurify from "dompurify";

export default function Register() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const router = useRouter();

  const handleImageChange = (image: string | null) => {
    setProfileImage(image);
  };

  const handleImageClick = () => {
    document.getElementById("profileImageInput")?.click();
  };

  const onSubmit = handleSubmit(async (data) => {
    // Sanitize inputs
    const sanitizedData = {
      firstname: DOMPurify.sanitize(data.firstname),
      lastname: DOMPurify.sanitize(data.lastname),
      email: DOMPurify.sanitize(data.email),
      password: DOMPurify.sanitize(data.password),
      confirmPassword: DOMPurify.sanitize(data.confirmPassword),
      age: DOMPurify.sanitize(data.age),
    };

    if (sanitizedData.password !== sanitizedData.confirmPassword) {
      return alert("Las contraseñas no son iguales.");
    }

    // Verificar que la contraseña sea segura
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(sanitizedData.password)) {
      return alert(
        "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial."
      );
    }

    // Verificar que el correo electrónico sea válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return alert("Por favor, ingresa un correo electrónico válido.");
    }

    const ageNumber = parseInt(sanitizedData.age);
    if (ageNumber < 18 || ageNumber >= 100) {
      return alert("La edad debe ser mayor o igual a 18 y menor a 100.");
    }

    const role = "teacher";

    let profilePictureUrl = null;
    if (profileImage) {
      const isSampleImage = [
        worm.src,
        book.src,
        diploma.src,
        dragon.src,
        reading.src,
      ].includes(profileImage);
      if (isSampleImage) {
        profilePictureUrl = profileImage;
      } else {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: JSON.stringify({ file: profileImage }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          profilePictureUrl = uploadData.url;
        } else {
          const errorData = await uploadRes.json();
          return alert("Error al subir la imagen de perfil.");
        }
      }
    }

    const requestBody = {
      firstname: sanitizedData.firstname,
      lastname: sanitizedData.lastname,
      age: ageNumber,
      email: sanitizedData.email,
      password: sanitizedData.password,
    };

    if (profilePictureUrl) {
      requestBody.profilePicture = profilePictureUrl;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/auth/login");
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Section */}
      <main className="flex-grow bg-[url('/BgRegister.png')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative flex justify-center items-center h-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg bg-[#445b50] rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-white text-center mb-8">
              Crear una Cuenta
            </h1>
            <div className="w-full bg-white rounded-md shadow-md p-6">
              {/* Upload Photo */}
              <div className="relative mb-6 flex justify-center items-center">
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleImageChange(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div
                  className={`relative cursor-pointer w-24 h-24 border ${
                    profileImage ? "border-green-500" : "border-gray-300"
                  } rounded-full flex justify-center items-center`}
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile Image"
                      className="w-24 h-24 rounded-full object-cover"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <Image
                      src={cameraIcon}
                      alt="Camera Icon"
                      className="w-16 h-16"
                    />
                  )}
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xl">+</span>
                  </div>
                </div>
              </div>
              {/* Image Options */}
              <div className="flex justify-center space-x-4 mb-6">
                {[worm, book, diploma, dragon, reading].map((imgSrc, index) => (
                  <div
                    key={index}
                    className="cursor-pointer w-16 h-16 border border-gray-300 rounded-full flex justify-center items-center"
                    onClick={() => handleImageChange(imgSrc.src)}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Option ${index + 1}`}
                      className="w-16 h-16 rounded-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                ))}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
              <form onSubmit={onSubmit}>
                {/* First Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("firstname", {
                      required: "Tu nombre es obligatorio.",
                    })}
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("lastname", {
                      required: "Tu apellido es obligatorio.",
                    })}
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("email", {
                      required: "Tu correo electrónico es obligatorio.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message:
                          "Por favor, ingresa un correo electrónico válido.",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("password", {
                      required: "Tu contraseña es obligatoria.",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("confirmPassword", {
                      required: "Verifica tu contraseña.",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Age */}
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Edad"
                    className="w-full bg-gray-200 rounded-lg px-4 py-3"
                    {...register("age", {
                      required: "Ingresa tu edad.",
                      min: {
                        value: 18,
                        message: "Debes tener al menos 18 años.",
                      },
                      max: {
                        value: 99,
                        message: "La edad debe ser menor a 100.",
                      },
                    })}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.age.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button className="w-full py-3 mt-6 text-white font-semibold bg-yellow-500 rounded-lg shadow-lg hover:bg-yellow-600 transition-all">
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
