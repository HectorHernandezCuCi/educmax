"use client"; // Add this directive for client-side rendering

import { useParams } from "next/navigation"; // Import useParams for dynamic URL params
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PencilAnimation from "@/components/loader/PencilAnimation"; // Import PencilAnimation
import studentsIcon from "@/img/students.png";
import Image from "next/image";

const GroupDetails = () => {
  const { groupId } = useParams(); // Get the groupId from the URL params
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null); // State to track errors
  const [showModal, setShowModal] = useState(false); // State to track modal visibility

  const router = useRouter(); // Get the router instance for navigation

  useEffect(() => {
    if (groupId) {
      // Fetch the group details based on groupId
      const fetchGroupDetails = async () => {
        try {
          const response = await fetch(`/api/group/${groupId}`);
          const data = await response.json();
          if (response.ok) {
            setGroup(data);
          } else {
            setError(data.error || "Error fetching group details");
          }
        } catch (error) {
          setError("Error fetching group details: " + error.message);
        } finally {
          setLoading(false); // Set loading to false once the request is done
        }
      };

      fetchGroupDetails();
    }
  }, [groupId]);

  const handleDeleteGroup = async () => {
    try {
      const response = await fetch(`/api/group/${groupId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/myGroups"); // Redirect to myGroups page after deleting group
      } else {
        setError("Error deleting group");
      }
    } catch (error) {
      setError("Error deleting group: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <PencilAnimation />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-10 p-5 bg-gray-50">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
      )}
      <div
        className={`min-h-screen pb-10 p-5 transition-opacity duration-300 ${
          loading ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-3xl uppercase text-gray-800">
            {group?.name}
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowModal(true)}
          >
            Configuración
          </button>
        </div>

        <div className="pt-6">
          {/* Class stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border border-gray-200 rounded-lg p-6 bg-white shadow-md">
            {/* Promedio de la clase */}
            <div className="text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
                Promedio de la clase
              </h2>
              <p className="text-4xl lg:text-6xl font-bold text-blue-600">
                {group?.average || "0%"}
              </p>
            </div>

            {/* Fillable Image */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 bg-gray-100 rounded-full overflow-hidden shadow-md">
                <div
                  className="absolute bottom-0 left-0 w-full bg-blue-500"
                  style={{
                    height: `${group?.average || 0}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold">
                  {group?.average || "0%"}
                </div>
              </div>
            </div>

            {/* Trabajos asignados */}
            <div className="text-center lg:text-right">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
                Trabajos asignados
              </h2>
              <p className="text-4xl lg:text-6xl font-bold text-green-500">
                {group?.works || "0"}
              </p>
            </div>
          </div>

          {/* Students */}
          <div className="mt-8">
            <h2 className="font-bold text-2xl uppercase text-gray-800 mb-4">
              Estudiantes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group?.studentGroups?.length > 0 ? (
                group.studentGroups.map(({ student }) => (
                  <div
                    key={student.id}
                    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-yellowMain"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gray-100 p-2">
                        <Image
                          className="w-16 h-16 object-cover"
                          src={studentsIcon}
                          alt={student.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No hay estudiantes en este grupo.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Configuración del Grupo
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={handleDeleteGroup}
                >
                  Eliminar Grupo
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
