"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import lecture from "@/img/lecture.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PencilAnimation from "@/components/loader/PencilAnimation"; // Import PencilAnimation

export default function CreateGroup() {
  const { data: session, status } = useSession();
  const [isSessionLoaded, setIsSessionLoaded] = useState(false); // Add loading state
  const [studentFields, setStudentFields] = useState([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [allStudentsRegistered, setAllStudentsRegistered] = useState(false);
  const [isGroupNameEntered, setIsGroupNameEntered] = useState(false);
  const [isStudentNameEntered, setIsStudentNameEntered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
    } else {
      setIsSessionLoaded(true);
    }
  }, [session, status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleGroupNameChange = (event) => {
    setIsGroupNameEntered(event.target.value.trim().length > 0);
  };

  const handleStudentNameChange = (event) => {
    setIsStudentNameEntered(event.target.value.trim().length > 0);
  };

  const handleStudentCountChange = (event) => {
    const count = parseInt(event.target.value, 10);
    if (isNaN(count) || count < 0) {
      setStudentFields([]);
      setCurrentStudentIndex(0);
      setAllStudentsRegistered(false);
      return;
    }
    setStudentFields(Array(count).fill(""));
    setCurrentStudentIndex(0);
    setAllStudentsRegistered(false);

    for (let i = 0; i < count; i++) {
      setValue(`students[${i}].name`, "");
      setValue(`students[${i}].listNumber`, i + 1);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < studentFields.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    } else {
      setAllStudentsRegistered(true);
    }
  };

  const onSubmit = async (data) => {
    try {
      const { name, grade, studentCount, startDate, endDate, notes, students } =
        data;

      console.log("Estudiantes a enviar:", students);

      if (!startDate || !endDate) {
        throw new Error("Las fechas de inicio y fin son obligatorias.");
      }

      const startDateISO = new Date(startDate);
      const endDateISO = new Date(endDate);

      if (isNaN(startDateISO.getTime()) || isNaN(endDateISO.getTime())) {
        throw new Error("Fecha inválida.");
      }

      const groupResponse = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          grade,
          studentCount,
          teacher: session.user.id,
          startDate: startDateISO.toISOString(),
          endDate: endDateISO.toISOString(),
          notes,
          students,
        }),
      });

      if (!groupResponse.ok) {
        const errorData = await groupResponse.json();
        throw new Error(errorData.error || "Error al crear el grupo.");
      }

      const group = await groupResponse.json();
      console.log("ID del grupo:", group.id);

      const studentsPromises = students.map(async (student) => {
        const studentResponse = await fetch(`/api/student`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: student.name,
            studentListNumber: student.listNumber,
          }),
        });

        if (!studentResponse.ok) {
          const errorData = await studentResponse.json();
          throw new Error(errorData.error);
        }

        const savedStudent = await studentResponse.json(); // Guardamos la respuesta del estudiante registrado
        console.log("Respuesta del API del estudiante:", savedStudent); // Debugging statement
        console.log(
          "Estructura del objeto savedStudent:",
          JSON.stringify(savedStudent, null, 2)
        ); // Detailed logging

        if (!savedStudent.student) {
          throw new Error(
            "El objeto savedStudent no contiene la propiedad 'student'."
          );
        }

        console.log(
          `Estudiante ingresado: ${savedStudent.student.name}, ID: ${savedStudent.student.id}`
        ); // Asegúrate de que la respuesta contenga el ID y nombre

        // Log the values before making the fetch request
        console.log("groupId:", group.id, "studentId:", savedStudent.student.id);

        // Ahora puedes usar el ID y nombre del estudiante para asociarlo al grupo
        const studentGroupResponse = await fetch("/api/studentGroup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            groupId: group.id,
            studentId: savedStudent.student.id, // Usamos el ID guardado
          }),
        });

        if (!studentGroupResponse.ok) {
          const errorData = await studentGroupResponse.json();
          throw new Error(
            errorData.error || "Error al asociar el grupo a los estudiantes."
          );
        }
      });

      // Esperar que todos los estudiantes se guarden y se asocien al grupo
      await Promise.all(studentsPromises);

      const teacherGroupResponse = await fetch("/api/teacherGroup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          groupId: group.id,
        }),
      });

      if (!teacherGroupResponse.ok) {
        const errorData = await teacherGroupResponse.json();
        throw new Error(
          errorData.error || "Error al asociar el grupo al maestro."
        );
      }

      alert("Grupo creado y asociado al maestro con éxito.");
      router.push(`/myGroups`);
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al crear el grupo: " + error.message);
    }
  };

  if (status === "loading" || !isSessionLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <PencilAnimation />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      {status === "loading" || !isSessionLoaded ? ( // Show loader if loading is true
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <PencilAnimation />
        </div>
      ) : null}
      <div className={`max-w-md bg-yellowMain w-full bg-white shadow-md rounded-lg p-6 ${status === "loading" || !isSessionLoaded ? 'opacity-50' : ''}`}>
        <div className="flex flex-col items-center mb-6">
          <Image src={lecture} alt="Lecture Icon" className="w-20 h-20 mb-4" />
          <p className="text-center text-gray-600 text-sm">
            Ingresa tu grupo para tener una mejor organización en tu trabajo
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Registra tu Clase
          </h1>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de tu Grupo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Escuela ejemplo o cualquier nombre"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("name", {
                required: "El nombre del grupo es obligatorio.",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres.",
                },
                maxLength: {
                  value: 50,
                  message: "No puede exceder los 50 caracteres.",
                },
              })}
              onChange={handleGroupNameChange}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700"
            >
              Grado
            </label>
            <input
              type="text"
              id="grade"
              placeholder="Ejemplo: 4°B"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("grade", {
                required: "El grado es obligatorio.",
                minLength: {
                  value: 1,
                  message: "Debe tener al menos 1 carácter.",
                },
                maxLength: {
                  value: 10,
                  message: "No puede exceder los 10 caracteres.",
                },
              })}
            />
            {errors.grade && (
              <span className="text-red-500 text-xs">
                {errors.grade.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="studentCount"
              className="block text-sm font-medium text-gray-700"
            >
              Número de Estudiantes
            </label>
            <input
              type="number"
              id="studentCount"
              placeholder="Ejemplo: 25"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("studentCount", {
                required: "El número de estudiantes es obligatorio.",
                valueAsNumber: true,
                min: { value: 1, message: "Debe haber al menos 1 estudiante." },
                max: {
                  value: 100,
                  message: "El número máximo de estudiantes es 100.",
                },
              })}
              onChange={handleStudentCountChange}
              disabled={isStudentNameEntered}
            />
            {errors.studentCount && (
              <span className="text-red-500 text-xs">
                {errors.studentCount.message}
              </span>
            )}
          </div>

          {/* Mostrar el campo del estudiante actual */}
          {studentFields.length > 0 && !allStudentsRegistered && (
            <div className="space-y-2 border p-4 bg-greenBG text-white rounded-lg shadow-sm">
              <h2 className="text-sm font-medium">
                Estudiante {currentStudentIndex + 1}
              </h2>
              <div>
                <label
                  htmlFor={`students[${currentStudentIndex}].name`}
                  className="block text-sm font-medium"
                >
                  Nombre del Estudiante
                </label>
                <input
                  type="text"
                  id={`students[${currentStudentIndex}].name`}
                  placeholder="Nombre del estudiante"
                  className="mt-1 block w-full p-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  {...register(`students[${currentStudentIndex}].name`, {
                    required: `El nombre del estudiante ${
                      currentStudentIndex + 1
                    } es obligatorio.`,
                  })}
                  onChange={handleStudentNameChange}
                />
                {errors.students?.[currentStudentIndex]?.name && (
                  <span className="text-red-500 text-xs">
                    {errors.students[currentStudentIndex].name?.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor={`students[${currentStudentIndex}].listNumber`}
                  className="block text-sm font-medium"
                >
                  Número de Lista
                </label>
                <input
                  type="number"
                  id={`students[${currentStudentIndex}].listNumber`}
                  className="mt-1 block w-full p-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={currentStudentIndex + 1} // El número de lista es automático
                  readOnly
                />
              </div>

              <button
                type="button"
                className="mt-4 w-full p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                onClick={handleNextStudent}
              >
                {currentStudentIndex < studentFields.length - 1
                  ? "Agregar Siguiente Estudiante"
                  : "Finalizar Registro de Estudiantes"}
              </button>
            </div>
          )}

          {allStudentsRegistered && (
            <p className="text-green-500 text-center">
              Todos los estudiantes fueron registrados.
            </p>
          )}

          {/* Otros campos */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="startDate"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("startDate", {
                required: "La fecha de inicio es obligatoria.",
                validate: (value) => {
                  return (
                    value >= today ||
                    "La fecha debe ser igual o posterior a hoy."
                  );
                },
              })}
              min={today}
            />
            {errors.startDate && (
              <span className="text-red-500 text-xs">
                {errors.startDate.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Fecha de Fin
            </label>
            <input
              type="date"
              id="endDate"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("endDate", {
                required: "La fecha de fin es obligatoria.",
                validate: (value) => {
                  const startDate = document.getElementById("startDate")?.value;
                  return (
                    value > startDate ||
                    "La fecha de fin debe ser posterior a la de inicio."
                  );
                },
              })}
              min={today}
            />
            {errors.endDate && (
              <span className="text-red-500 text-xs">
                {errors.endDate.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Nota (opcional)
            </label>
            <textarea
              id="note"
              placeholder="Notas adicionales"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              {...register("notes", {
                maxLength: {
                  value: 200,
                  message: "No puede exceder los 200 caracteres.",
                },
              })}
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Crear Grupo
          </button>
        </form>
      </div>
    </div>
  );
}
