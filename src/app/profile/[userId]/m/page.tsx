"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Search from "@/components/resources/search";
import PencilAnimation from "@/components/loader/PencilAnimation";
import configurationIcon from "@/img/settingIcon.png";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortByLikes, setSortByLikes] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/post/${session.user.id}`);
      if (response.status === 404) {
        console.error("Posts not found");
        return;
      }
      const data = await response.json();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      const userId = window.location.pathname.split("/")[2];
      console.log("session.user.id:", session.user.id);
      console.log("userId from URL:", userId);
      if (!session.user.id) {
        console.error("session.user.id is undefined");
        return;
      }
      if (session.user.id !== userId) {
        console.error("User ID does not match");
        router.push("/unauthorized");
        return;
      }

      const fetchProfile = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const userData = await response.json();
          console.log(userData);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
      fetchPosts();
    }
  }, [session, fetchPosts, router]);

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const resetFilter = () => {
    setFilteredPosts(posts);
  };

  const sortedPosts = sortByLikes
    ? [...filteredPosts].sort((a, b) => b.likes.length - a.likes.length)
    : filteredPosts;

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
        setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <PencilAnimation />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10">
      {loading && ( // Show loader if loading is true
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
      )}
      <div className={`min-h-screen pb-10 ${loading ? "opacity-50" : ""}`}>
        <div className="m-8 flex items-center justify-center p-8 space-x-8 bg-white shadow rounded-lg">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Image
              src={session.user.profilePicture}
              alt="Profile Picture"
              className="rounded-full"
              width={160}
              height={160}
              priority // Add priority property
            />
          </div>
          {/* User Data */}
          <div>
            <h1 className="text-3xl font-bold uppercase">
              {session.user.name}
            </h1>
          </div>
          {/* Configuration Icon */}
          <div>
            <Image
              src={configurationIcon}
              alt="Configuration Icon"
              width={40}
              height={40}
              onClick={() =>
                router.push(`/profile/${session.user.id}/configuration`)
              }
              className="cursor-pointer"
            />
          </div>
        </div>
        {/* User Posts */}
        <div className="mt-8 m-8 bg-white p-5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Mis Posts</h2>
          <div className="flex items-center justify-between">
            <Search onSearch={handleSearch} />
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setSortByLikes(!sortByLikes)}
            >
              {sortByLikes ? "Ordenar por fecha" : "Ordenar por favoritos"}
            </button>
            <button
              className="mb-4 ml-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={resetFilter}
            >
              Quitar filtro
            </button>
          </div>
          <div className="space-y-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <div key={post.id} className="bg-white p-2 rounded shadow">
                  <p className="text-gray-700 mb-2 text-sm">{post.content}</p>
                  {post.filePath && (
                    <div className="mb-2">
                      {post.filePath.endsWith(".pdf") ? (
                        <embed
                          src={post.filePath}
                          width="100%"
                          height="300px"
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
                    </div>
                  )}
                  <p className="text-gray-500 text-xs">
                    Likes: {post.likes.length}
                  </p>
                  <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deletePost(post.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p>No has realizado ningún post.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
