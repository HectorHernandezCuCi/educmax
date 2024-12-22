"use client";
import educMaxLogo from "@/img/EducMaxLogo.png";
import { RegisterBtn } from "@/components/header/registerBtn";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/register/photoUpload";
import { useForm } from "react-hook-form";

export default function Register() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const handleImageChange = (image: string | null) => {
    setProfileImage(image);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Las contraseñas no son iguales.");
    }

    const ageNumber = parseInt(data.age);
    const role = "teacher";

    let profilePictureUrl = null;
    if (profileImage) {
      console.log("Uploading image:", profileImage); // Verificar que la imagen se está enviando

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
        console.log("Image uploaded, URL:", profilePictureUrl); // Verificar la URL de la imagen subida
      } else {
        const errorData = await uploadRes.json();
        console.error("Error uploading image:", errorData);
        return alert("Error al subir la imagen de perfil.");
      }
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstname: data.firstname,
        lastname: data.lastname,
        age: ageNumber,
        email: data.email,
        password: data.password,
        profilePicture: profilePictureUrl,
      }),
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
        <div className="relative flex justify-center items-center h-full">
          <div className="w-full max-w-lg bg-[#445b50] rounded-lg p-8">
            <h1 className="text-3xl font-extrabold text-white text-center mb-8">
              Crear una Cuenta
            </h1>
            <div className="w-full bg-white rounded-md shadow-md p-6">
              <form onSubmit={onSubmit}>
                {/* Upload Photo */}
                <PhotoUpload onImageChange={handleImageChange} />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}

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
                    {...register("age", { required: "Ingresa tu edad." })}
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
