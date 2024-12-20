"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function Resources() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onSubmit = handleSubmit((data) => {
    // Handle form submission
  });

  const onEmojiClick = (emojiObject) => {
    const currentText = getValues("resourceDescription") || "";
    setValue("resourceDescription", currentText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-8 grid grid-cols-3 gap-8">
      {/* menu Side bar */}
      <div className="col-span-1 bg-white p-4 rounded shadow sticky top-0 max-h-screen h-auto overflow-y-auto">
        <form className="mb-4">
          <input
            type="text"
            placeholder="Buscar"
            {...register("search")}
            className="w-full p-2 border rounded"
          />
        </form>
        <div>
          <h1 className="text-xl font-bold mb-4">Mis Grupos</h1>
          <ul className="space-y-2">
            <li className="p-2 bg-gray-100 rounded">Grupo 1</li>
            <li className="p-2 bg-gray-100 rounded">Grupo 2</li>
            <li className="p-2 bg-gray-100 rounded">Grupo 3</li>
          </ul>
        </div>
      </div>
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-center">
          Comparte con los maestros
        </h1>
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          {/* Text about the resource */}
          <textarea
            placeholder="Animate a compartir!"
            {...register("resourceDescription", { required: true })}
            name="resourceDescription"
            id=""
            className="w-full p-2 border rounded"
          ></textarea>
          {errors.resourceDescription && (
            <span className="text-red-500">This field is required</span>
          )}

          <div className="flex justify-between items-center space-x-4">
            {/* File upload */}
            <div className="flex-1">
              <input
                type="file"
                {...register("resourceFile", { required: true })}
                name="resourceFile"
                className="w-full p-2 border rounded"
              />
              {errors.resourceFile && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* Emoji button */}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                Añade emojis
              </button>
              {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
            </div>

            <button
              type="submit"
              className="flex-1 p-2 bg-green-500 text-white rounded"
            >
              Subir
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Ejemplo de Posts</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://via.placeholder.com/40`}
                    alt="User"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold">Usuario {index + 1}</h3>
                    <p className="text-gray-500">Hace {index + 1} horas</p>
                  </div>
                </div>
                <img
                  src={`https://via.placeholder.com/600x400`}
                  alt="Post"
                  className="w-full h-auto rounded mb-4"
                />
                <p className="text-gray-700 mb-4">
                  Este es un ejemplo de post {index + 1}.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-500">
                      👍 {index * 10 + 5} Likes
                    </button>
                    <button className="text-blue-500">
                      💬 {index * 2 + 1} Comentarios
                    </button>
                  </div>
                  <button className="text-blue-500">Compartir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
