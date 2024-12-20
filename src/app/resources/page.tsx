"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function Resources() {
  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();
  const router = useRouter();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch logged-in user's ID
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const result = await response.json();
        if (result.user) {
          setUserId(result.user.id);
        } else {
          setMessage("Crea una cuenta o inicia sesión para compartir con todos");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    // Fetch groups for the logged-in user
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/teacherGroup");
        setGroups(response.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    // Fetch posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserId();
    fetchGroups();
    fetchPosts();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", "Nuevo Recurso");
      formData.append("content", data.resourceDescription);
      formData.append("userId", userId); // Use dynamic user ID

      if (data.resourceFile && data.resourceFile[0]) {
        formData.append("file", data.resourceFile[0]);
      }

      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        setMessage("Post subido exitosamente");
        reset(); // Clear the form
        // Refresh posts after successful submission
        const fetchPosts = async () => {
          try {
            const response = await fetch("/api/post");
            const result = await response.json();
            setPosts(result.posts);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
        fetchPosts();
      } else {
        const result = await response.json();
        setMessage(result.error || "Error al subir el post");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Error al subir el post");
    }
  };

  const onEmojiClick = (emojiObject) => {
    const currentText = getValues("resourceDescription") || "";
    setValue("resourceDescription", currentText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        setMessage("Post eliminado exitosamente");
        // Refresh posts after successful deletion
        const fetchPosts = async () => {
          try {
            const response = await fetch("/api/post");
            const result = await response.json();
            setPosts(result.posts);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
        fetchPosts();
      } else {
        const result = await response.json();
        setMessage(result.error || "Error al eliminar el post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage("Error al eliminar el post");
    }
  };

  return (
    <div className="p-8 grid grid-cols-3 gap-8 min-h-screen">
      {/* menu Side bar */}
      <div className="col-span-1 bg-white p-4 rounded shadow sticky top-0 max-h-screen h-auto overflow-y-auto">
        <form className="mb-4">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full p-2 border rounded"
          />
        </form>
        <div>
          <h1 className="text-xl font-bold mb-4">Mis Grupos</h1>
          {groups.length > 0 ? (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li
                  key={group.id}
                  className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => router.push(`/myGroups/${group.id}`)}
                >
                  {group.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">No tienes grupos. ¡Anímate a organizarte!</p>
              <button
                onClick={() => router.push("/myGroups")}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Aquí
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold mb-4 text-center">
          Comparte con los maestros
        </h1>
        {userId ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
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
                  {...register("resourceFile")}
                  name="resourceFile"
                  className="w-full p-2 border rounded"
                />
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
        ) : (
          <p className="text-center text-red-500">{message}</p>
        )}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={`https://via.placeholder.com/40`}
                        alt="User"
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{post.title}</h3>
                        <p className="text-gray-500">{post.createdAt}</p>
                      </div>
                    </div>
                    {post.userId === userId && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 bg-red-500 text-white rounded"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-4">Todo está muy solo aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
