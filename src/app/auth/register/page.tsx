"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import teacherIcon from "@/img/teacher.png";
import emailIcon from "@/img/email.png";
import padlockIcon from "@/img/padlock.png";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/");
      router.refresh();
    }
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 py-10">
      <div>
        <Image
          src={teacherIcon}
          alt="Teacher Icon"
          className="w-20 h-20 mb-5"
        />
      </div>
      <div className="text-2xl">
        <p className="text-gray-600 text-sm">
          ¿Todavía no tienes una cuenta?{" "}
          <span>
            <a href="/auth/register" className="text-green-600 hover:underline">
              Crea una cuenta
            </a>
          </span>
          .
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="w-96 p-6 bg-white rounded-xl shadow-lg"
      >
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
            {error}
          </p>
        )}

        <h1 className="font-bold text-4xl text-center mb-6 text-gray-800">
          Inicio de Sesión
        </h1>

        {/* Email Input */}
        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <div className="flex items-center border-b-2 border-gray-300 mb-4">
          <Image src={emailIcon} alt="Email Icon" className="w-6 h-6 mr-3" />
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
            })}
            className="flex-1 p-2 bg-transparent focus:outline-none text-slate-300"
            placeholder="user@email.com"
          />
        </div>
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}

        {/* Password Input */}
        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Password:
        </label>
        <div className="flex items-center border-b-2 border-gray-300 mb-4">
          <Image
            src={padlockIcon}
            alt="Padlock Icon"
            className="w-6 h-6 mr-3"
          />
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            className="flex-1 p-2 bg-transparent focus:outline-none text-slate-300"
            placeholder="******"
          />
        </div>
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}

        <button className="w-full bg-yellowMain text-white p-3 rounded-lg mt-4 hover:bg-yellow-600">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
