"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Search from "@/components/resources/search";
import PencilAnimation from "@/components/loader/PencilAnimation";
import { useRouter, usePathname } from "next/navigation";
import schoolIcon from "@/img/backToschool.png";
import heartIcon from "@/img/heart.png";

export default function Profile() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortByLikes, setSortByLikes] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const userId = pathname.split("/").pop();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/post/${userId}`);
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
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`/api/user/${userId}`);
          if (response.status === 404) {
            console.error("User not found");
            return;
          }
          const userData = await response.json();
          console.log("Fetched user data:", userData); // Debug log
          setProfileData(userData.user); // Access the nested user object
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
      fetchPosts();
    }
  }, [userId, fetchPosts]);

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

  const downloadFile = (filePath) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
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
            {profileData?.profilePicture ? (
              <Image
                src={profileData.profilePicture}
                alt="Profile Picture"
                className="rounded-full"
                width={160}
                height={160}
                priority // Add priority property
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
            )}
          </div>
          {/* User Data */}
          <div>
            <h1 className="text-3xl font-bold uppercase">
              {profileData?.name + " " + profileData?.lastname || "Cargando..."}
            </h1>
          </div>
        </div>
        {/* User Posts */}
        <div className="mt-8 m-8 bg-white p-5 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Mis Posts</h2>
          <div className="flex items-center justify-between">
            <Search onSearch={handleSearch} />
            <button
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => setSortByLikes(!sortByLikes)}
            >
              {sortByLikes ? "Ordenar por fecha" : "Ordenar por favoritos"}
            </button>
            <button
              className="mb-4 ml-2 px-4 py-2 bg-green-500 text-white rounded"
              onClick={resetFilter}
            >
              Quitar filtro
            </button>
          </div>
          <div className="space-y-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border rounded-lg shadow-md p-4 mb-6 "
                >
                  <p className="text-gray-800 font-semibold text-lg truncate">
                    {post.content}
                  </p>
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
                          className="rounded-lg shadow-md w-full h-auto object-cover border"
                        />
                      )}
                    </div>
                  )}
                  <p className="text-gray-500 text-xs flex items-center">
                    <Image src={heartIcon} alt="Likes" width={16} height={16} className="mr-1" />
                    {post.likes.length}
                  </p>
                </div>
              ))
            ) : (
              <p>No ha realizado ningún post.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
