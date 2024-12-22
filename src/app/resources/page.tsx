"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";
import LikeButton from "@/components/resources/likeButton";
import folderIcon from "@/img/folderIcon.png";
import emojiIcon from "@/img/emojiIcon.png";
import Image from "next/image";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function Resources() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState("https://via.placeholder.com/40"); // Set default profile picture
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Fetch logged-in user's ID and profile picture
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.status === 401) {
          setMessage("Debes iniciar sesión para interactuar con los posts");
          return;
        }
        const result = await response.json();
        console.log("User data:", result.user); // Verificar los datos del usuario
        if (result.user) {
          setUserId(result.user.id);
          setProfilePicture(result.user.profilePicture || "https://via.placeholder.com/40"); // Set profile picture
          console.log("Profile picture URL:", result.user.profilePicture); // Verificar la URL de la imagen de perfil
        } else {
          setMessage(
            "Crea una cuenta o inicia sesión para compartir con todos"
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch groups for the logged-in user
    const fetchGroups = async () => {
      try {
        const response = await axios.get("/api/teacherGroup");
        setGroups(response.data.groups);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setMessage("Debes iniciar sesión para ver tus grupos");
        } else {
          console.error("Error fetching groups:", error);
        }
      }
    };

    // Fetch posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post");
        const postsWithUser = await Promise.all(
          response.data.posts.map(async (post) => {
            try {
              const userResponse = await axios.get(`/api/user/${post.userId}`);
              return { ...post, user: userResponse.data.user };
            } catch (error) {
              console.error(`Error fetching user data for post ${post.id}:`, error);
              return { ...post, user: null };
            }
          })
        );
        setPosts(postsWithUser);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserData();
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
        const file = data.resourceFile[0];
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "video/mp4"];
        if (!allowedTypes.includes(file.type)) {
          setMessage("Solo se permiten archivos PDF, imágenes y videos.");
          return;
        }
        formData.append("file", file);
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
            const postsWithUser = await Promise.all(
              result.posts.map(async (post) => {
                try {
                  const userResponse = await axios.get(`/api/user/${post.userId}`);
                  return { ...post, user: userResponse.data.user };
                } catch (error) {
                  console.error(`Error fetching user data for post ${post.id}:`, error);
                  return { ...post, user: null };
                }
              })
            );
            setPosts(postsWithUser);
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
            const postsWithUser = await Promise.all(
              result.posts.map(async (post) => {
                try {
                  const userResponse = await axios.get(`/api/user/${post.userId}`);
                  return { ...post, user: userResponse.data.user };
                } catch (error) {
                  console.error(`Error fetching user data for post ${post.id}:`, error);
                  return { ...post, user: null };
                }
              })
            );
            setPosts(postsWithUser);
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

  const likePost = async (postId) => {
    if (!userId) {
      setMessage("Debes iniciar sesión para dar like a los posts");
      return;
    }

    try {
      const response = await fetch("/api/post", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId }),
      });

      if (response.status === 200) {
        const result = await response.json();
        setMessage(result.message || "Post liked exitosamente");
        // Refresh posts after successful like/unlike
        const fetchPosts = async () => {
          try {
            const response = await fetch("/api/post");
            const result = await response.json();
            const postsWithUser = await Promise.all(
              result.posts.map(async (post) => {
                try {
                  const userResponse = await axios.get(`/api/user/${post.userId}`);
                  return { ...post, user: userResponse.data.user };
                } catch (error) {
                  console.error(`Error fetching user data for post ${post.id}:`, error);
                  return { ...post, user: null };
                }
              })
            );
            setPosts(postsWithUser);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
        fetchPosts();
      } else {
        const result = await response.json();
        setMessage(result.error || "Error al dar like al post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setMessage("Error al dar like al post");
    }
  };

  const handleDownload = (filePath) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    window.location.href = filePath;
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
          {userId ? (
            groups.length > 0 ? (
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
                <p className="text-gray-500 mb-4">
                  No tienes grupos. ¡Anímate a organizarte!
                </p>
                <button
                  onClick={() => router.push("/myGroups")}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Aquí
                </button>
              </div>
            )
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                Inicia sesión para organizar tus grupos
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Iniciar sesión
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-4">
              {profilePicture && (
                <Image
                  src={profilePicture}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              )}
              <textarea
                placeholder="Animate a compartir!"
                {...register("resourceDescription", { required: true })}
                name="resourceDescription"
                id="resourceDescription"
                className="w-full p-2 border-none"
                style={{ resize: "none" }}
              ></textarea>
            </div>
            {errors.resourceDescription && (
              <span className="text-red-500">This field is required</span>
            )}

            <div className="flex items-center justify-between space-x-4">
              <div className="flex gap-8">
                {/* File upload */}
                <div className="flex-1">
                  <label htmlFor="resourceFile" className="cursor-pointer">
                    <Image src={folderIcon} alt="Upload" className="w-8 h-8" />
                  </label>
                  <input
                    type="file"
                    {...register("resourceFile")}
                    name="resourceFile"
                    id="resourceFile"
                    className="hidden"
                  />
                </div>

                {/* Emoji button */}
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Image
                      src={emojiIcon}
                      alt="Emoji Icon"
                      className="w-8 h-8"
                    />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-10">
                      <Picker onEmojiClick={onEmojiClick} />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="p-2 bg-yellowMain hover:cursor-pointer hover:bg-yellow-500 text-white rounded w-60"
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
                        src={post.user?.profilePicture || "https://via.placeholder.com/40"}
                        alt="User"
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="text-gray-500">{post.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {post.userId === userId && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 bg-red-500 text-white rounded"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{post.content}</p>
                  {post.filePath && (
                    <div className="mb-4">
                      {post.filePath.endsWith(".pdf") ? (
                        <embed src={post.filePath} width="100%" height="500px" type="application/pdf" />
                      ) : post.filePath.endsWith(".mp4") ? (
                        <video controls width="100%">
                          <source src={post.filePath} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={post.filePath} alt="Uploaded file" className="w-full h-auto" />
                      )}
                      <button
                        onClick={() => handleDownload(post.filePath)}
                        className="mt-2 inline-block p-2 bg-blue-500 text-white rounded"
                      >
                        Descargar
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-5">
                    {userId && (
                      <LikeButton
                        isLiked={
                          post.likes &&
                          post.likes.some((like) => like.userId === userId)
                        }
                        onClick={() => likePost(post.id)}
                      />
                    )}
                    <span>{post._count.likes} Likes</span>
                  </div>
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
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <p className="mb-4">Debes iniciar sesión para descargar el contenido</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="p-2 bg-gray-500 text-white rounded ml-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
