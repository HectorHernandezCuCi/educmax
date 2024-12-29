"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession
import dynamic from "next/dynamic";
import axios from "axios";
import LikeButton from "@/components/resources/likeButton";
import Search from "@/components/resources/search";
import folderIcon from "@/img/folderIcon.png";
import emojiIcon from "@/img/emojiIcon.png";
import Image from "next/image";
import { format } from "date-fns";
import PencilAnimation from "@/components/loader/PencilAnimation"; // Import PencilAnimation
import BinButton from "@/components/resources/BinButton";
import heartIcon from "@/img/heart.png";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const Resources = () => {
  const { data: session } = useSession(); // Use useSession to get session data
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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/40"
  ); // Set default profile picture
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.status === 401) {
        setMessage("Debes iniciar sesión para interactuar con los posts");
        return;
      }
      const result = await response.json();
      if (result.user) {
        setUserId(result.user.id);
        setProfilePicture(
          result.user.profilePicture || "https://via.placeholder.com/40"
        ); // Set profile picture
      } else {
        setMessage("Crea una cuenta o inicia sesión para compartir con todos");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
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
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get("/api/post");
      const postsWithUser = await Promise.all(
        response.data.posts.map(async (post) => {
          try {
            const userResponse = await axios.get(`/api/user/${post.userId}`);
            return { ...post, user: userResponse.data.user };
          } catch (error) {
            console.error(
              `Error fetching user data for post ${post.id}:`,
              error
            );
            return { ...post, user: null };
          }
        })
      );
      setPosts(postsWithUser);
      setFilteredPosts(postsWithUser);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false); // Set loading to false in case of error
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchGroups();
    fetchPosts();
  }, [fetchUserData, fetchGroups, fetchPosts]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [fetchUserData]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", "Nuevo Recurso");
      formData.append("content", data.resourceDescription);
      formData.append("userId", userId); // Use dynamic user ID

      if (data.resourceFile && data.resourceFile[0]) {
        const file = data.resourceFile[0];
        const allowedTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "video/mp4",
        ];
        if (!allowedTypes.includes(file.type)) {
          setMessage("Solo se permiten archivos PDF, imágenes y videos.");
          return;
        }

        let folder = "";
        if (file.type === "application/pdf") {
          folder = "PDF";
        } else if (file.type.startsWith("image/")) {
          folder = "Image";
        } else if (file.type === "video/mp4") {
          folder = "Video";
        }

        formData.append("file", file);
        formData.append("folder", `upload/${userId}/${folder}`);
      }

      const response = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        setMessage("Post subido exitosamente");
        reset(); // Clear the form
        fetchPosts(); // Refresh posts after successful submission
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
        fetchPosts(); // Refresh posts after successful deletion
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
        fetchPosts(); // Refresh posts after successful like/unlike
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = (now - date) / 1000;

    if (diffInSeconds < 60) {
      return `Hace ${Math.floor(diffInSeconds)} segundos`;
    } else if (diffInSeconds < 3600) {
      return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    } else if (diffInSeconds < 86400) {
      return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    } else {
      return format(date, "MM/dd/yyyy");
    }
  };

  const handleSearch = useCallback(
    (query) => {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = posts.filter((post) => {
        const fileTypeMatch =
          post.filePath && post.filePath.toLowerCase().includes(lowerCaseQuery);
        const contentMatch = post.content
          .toLowerCase()
          .includes(lowerCaseQuery);
        return fileTypeMatch || contentMatch;
      });
      setFilteredPosts(filtered);
    },
    [posts]
  );

  const handleFilter = useCallback(
    (fileType) => {
      setActiveFilter(fileType);
      const filtered = posts.filter((post) => {
        if (fileType === "pdf") {
          return post.filePath && post.filePath.endsWith(".pdf");
        } else if (fileType === "image") {
          return (
            post.filePath &&
            (post.filePath.endsWith(".jpeg") ||
              post.filePath.endsWith(".jpg") ||
              post.filePath.endsWith(".png"))
          );
        } else if (fileType === "video") {
          return post.filePath && post.filePath.endsWith(".mp4");
        }
        return true;
      });
      setFilteredPosts(filtered);
    },
    [posts]
  );

  const MemoizedPost = useMemo(() => {
    return filteredPosts.map((post) => (
      <div key={post.id} className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <a href={`/profile/${post.userId}`}>
              <img
                src={
                  post.user?.profilePicture || "https://via.placeholder.com/40"
                }
                alt="User"
                className="w-10 h-10 rounded-full mr-4"
              />
            </a>
            <div>
              <a href={`/profile/${post.userId}`}>
                <h3 className="font-bold">
                  {post.user?.name} {post.user?.lastname}
                </h3>
              </a>
              <p className="text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {post.userId === userId && (
              <BinButton onClick={() => deletePost(post.id)} />
            )}
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        {post.filePath && (
          <div className="mb-4">
            {post.filePath.endsWith(".pdf") ? (
              <embed
                src={post.filePath}
                width="100%"
                height="500px"
                type="application/pdf"
              />
            ) : post.filePath.endsWith(".mp4") ? (
              <video controls width="100%">
                <source src={post.filePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={post.filePath}
                alt="Uploaded file"
                className="w-full h-auto"
              />
            )}
            <button
              className="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-5"
              onClick={() => handleDownload(post.filePath)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                height="24px"
                width="24px"
              >
                <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  id="SVGRepo_tracerCarrier"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g id="Interface / Download">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2"
                      stroke="#f1f1f1"
                      d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                      id="Vector"
                    ></path>
                  </g>
                </g>
              </svg>
              Descargar
            </button>
          </div>
        )}
        <div className="flex items-center gap-5">
          {userId && (
            <LikeButton
              isLiked={
                post.likes && post.likes.some((like) => like.userId === userId)
              }
              onClick={() => likePost(post.id)}
            />
          )}
          {userId ? (
            <span>{post._count.likes} Likes</span>
          ) : (
            <div className="flex items-center">
              <Image
                src={heartIcon}
                alt="Heart Icon"
                className="w-5 h-5 mr-2"
              />
              <span>{post._count.likes}</span>
            </div>
          )}
        </div>
      </div>
    ));
  }, [filteredPosts, userId]);

  if (!session) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <PencilAnimation />
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && ( // Show loader if loading is true
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
      )}
      <div
        className={`p-8 grid grid-cols-3 gap-8 min-h-screen ${
          loading ? "opacity-50" : ""
        }`}
      >
        {/* menu Side bar */}
        <div className="flex flex-col  gap-5 col-span-1 bg-white p-4 rounded shadow sticky top-0 max-h-screen h-auto overflow-y-auto">
          <Search onSearch={handleSearch} />
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
                    className="p-2 bg-yellow-400 w-full hover:bg-yellow-500 text-white text-white rounded"
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
                  className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
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
                {session.user.profilePicture && (
                  <Image
                    key={session.user.profilePicture} // Add key to force re-render
                    src={session.user.profilePicture}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                    width={40} // Add width property
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
                  <div className="relative flex-1 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-lg flex items-center justify-center">
                    <label
                      htmlFor="resourceFile"
                      className="cursor-pointer flex items-center justify-center"
                    >
                      <Image
                        src={folderIcon}
                        alt="Upload"
                        className="w-8 h-8"
                      />
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
                  <div className="relative flex-1 transition-all duration-300 ease-in-out hover:bg-yellow-500 hover:scale-105 hover:shadow-lg rounded-lg">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2"
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
            <div className="flex items-center justify-center bg-greenBG py-4 rounded-md shadow-lg">
              <p className="text-center text-yellowMain font-bold text-lg px-4">
                {message}
              </p>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Posts</h2>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleFilter("pdf")}
                className={`p-2 rounded mx-2 ${
                  activeFilter === "pdf"
                    ? "bg-yellow-700 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => handleFilter("image")}
                className={`p-2 rounded mx-2 ${
                  activeFilter === "image"
                    ? "bg-yellow-700 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                Imágenes
              </button>
              <button
                onClick={() => handleFilter("video")}
                className={`p-2 rounded mx-2 ${
                  activeFilter === "video"
                    ? "bg-yellow-700 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                Videos
              </button>
            </div>
            <div className="space-y-4">
              {loading ? ( // Show loader if loading is true
                <div className="flex justify-center items-center">
                  <PencilAnimation />
                </div>
              ) : filteredPosts.length > 0 ? (
                MemoizedPost
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">
                    No se encontraron posts relacionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {showLoginModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg text-center">
              <p className="mb-4">
                Debes iniciar sesión para descargar el contenido
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
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
    </div>
  );
};

export default Resources;
