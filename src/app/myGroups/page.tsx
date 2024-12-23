"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import schoolBg from "@/img/schoolBg.jpg";
import humanGroup from "@/img/humanGroup.png";
import groupIcon from "@/img/diversity.png";
import PencilAnimation from "@/components/loader/PencilAnimation"; // Import PencilAnimation

export default function MyGroups() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      // Fetch grupos del usuario logueado
      const fetchGroups = async () => {
        try {
          const response = await fetch("/api/teacherGroup", {
            method: "GET",
          });
          const data = await response.json();
          setGroups(data.groups || []);
        } catch (error) {
          console.error("Error fetching groups:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchGroups();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <PencilAnimation />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Por favor, inicia sesión para ver tus grupos.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10">
      {loading && ( // Show loader if loading is true
        <div className="min-h-screen fixed inset-0 flex items-center justify-center bg-white z-50">
          <PencilAnimation />
        </div>
      )}
      <div className={`min-h-screen pb-10 ${loading ? 'opacity-50' : ''}`}>
        <div className="p-4 rounded-xl max-w-4xl mx-auto h-60">
          <div
            className="w-full h-full bg-cover bg-center flex justify-center items-center rounded-xl"
            style={{
              backgroundImage: `url(${schoolBg.src})`,
            }}
          >
            <div className="bg-black bg-opacity-60 p-6 shadow-lg w-full mx-auto rounded-lg h-full flex items-center">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 w-full">
                {/* Text Section */}
                <div className="text-white text-center lg:text-left flex flex-col gap-2 lg:gap-4">
                  <h1 className="font-extrabold text-lg sm:text-xl lg:text-2xl">
                    Te damos la bienvenida a EducMax
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg leading-snug max-w-prose mx-auto lg:mx-0">
                    Una página donde puedes organizar tus grupos de clase y
                    compartir tus recursos con otros maestros para mejorar sus
                    clases.
                  </p>
                </div>

                {/* Image Section */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={humanGroup}
                    alt="Teacher Icon"
                    className="object-cover w-full h-full"
                    width={80} // Add width property
                    height={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-10 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-4xl p-3 font-bold">
          <h1>Mis Grupos</h1>
        </div>
        <div className="flex items-center flex-wrap gap-8">
          <div className="w-full sm:w-1/2 lg:w-1/4">
            <a href="/myGroups/createGroup">
              <div className="flex sm:justify-center lg:justify-start p-8">
                <div className="flex flex-col items-center gap-5 bg-yellowMain p-8 font-bold rounded-xl hover:cursor-pointer hover:bg-yellow-500 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-yellow-400">
                  <Image
                    src={groupIcon}
                    alt="groupIcon"
                    className="w-20 h-20"
                    width={80} // Add width property
                    height={80}
                  />
                  <p>Ingresa tu grupo</p>
                </div>
              </div>
            </a>
          </div>

          {groups.length > 0 ? (
            groups.map((group) => (
              <div key={group.id} className="w-full sm:w-1/2 lg:w-1/4">
                <a href={`/myGroups/${group.id}`}>
                  <div className="flex flex-col items-center gap-5 bg-yellowMain p-8 font-bold rounded-xl hover:cursor-pointer hover:bg-yellow-500 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-yellow-400">
                    <Image
                      src={groupIcon}
                      alt="groupIcon"
                      className="w-20 h-20"
                      width={80} // Add width property
                      height={80}
                    />
                    <p>{group.name || "Nombre no disponible"}</p>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p>No tienes grupos creados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
