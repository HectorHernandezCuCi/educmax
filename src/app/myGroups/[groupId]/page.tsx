"use client"; // Add this directive for client-side rendering

import { useParams } from "next/navigation"; // Import useParams for dynamic URL params
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PencilAnimation from "@/components/loader/PencilAnimation"; // Import PencilAnimation

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
    <div className="relative min-h-screen pb-10 p-5">
      {loading && ( // Show loader if loading is true
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
      )}
      <div className={`min-h-screen pb-10 p-5 ${loading ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl uppercase">{group?.name}</h1>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Configuración
          </button>
        </div>
        <div className="pt-6 px-4">
          {/* Class stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center justify-center border border-gray-300 rounded-lg p-6 bg-white shadow-lg">
            {/* Promedio de la clase */}
            <div className="text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
                Promedio de la clase
              </h1>
              <p className="text-4xl lg:text-6xl font-bold text-blue-500">
                {group?.average || "0%"}
              </p>
            </div>

            {/* Fillable Image */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 bg-gray-200 rounded-full overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute top-0 left-0 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/path/to/your/image.png')",
                    height: `${group?.average || 0}%`, // Dynamically set the fill based on percentage
                  }}
                ></div>
                {/* Overlay Text (optional) */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-bold">
                  {group?.average || "0%"}
                </div>
              </div>
            </div>

            {/* Trabajos asignados */}
            <div className="text-center lg:text-right">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
                Trabajos asignados
              </h1>
              <p className="text-4xl lg:text-6xl font-bold text-green-500">
                {group?.works || "0"}
              </p>
            </div>
          </div>

          {/* Students */}
          <div>
            <h1 className="font-bold text-3xl uppercase">Estudiantes</h1>
            <div className="grid grid-cols-1 gap-4">
              {group?.studentGroups?.length > 0 ? (
                group.studentGroups.map(({ student }) => (
                  <div
                    key={student.id}
                    className="p-4 bg-white rounded-lg shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-16 h-16 rounded-full object-cover"
                        src={student.avatar}
                        alt={student.name}
                      />
                      <div>
                        <h2 className="text-sm font-semibold">{student.name}</h2>
                        <p className="text-gray-500 text-xs">{student.grade}</p>
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

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Configuración del Grupo</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteGroup}
              >
                Eliminar Grupo
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
                onClick={() => setShowModal(false)}
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

export default GroupDetails;
