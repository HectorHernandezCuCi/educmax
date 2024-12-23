"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProfile({ userId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    profilePicture: "",
  });
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!userId) {
        try {
          const response = await axios.get("/api/auth/session");
          userId = response.data.user.id;
        } catch (error) {
          setError("Error al obtener la sesión del usuario");
          return;
        }
      }

      // Verificación de usuario logueado
      if (session?.user) {
        const loggedInUserId = session.user.id;
        console.log("session.user.id:", loggedInUserId);
        console.log("userId from URL:", userId);
        if (loggedInUserId !== userId) {
          console.error("User ID does not match");
          router.push("/unauthorized");
          return;
        }
      }

      // Fetch user data
      axios
        .get(`/api/user/${userId}`)
        .then((response) => setUser(response.data.user))
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
          if (error.response && error.response.status === 404) {
            setError("Usuario no encontrado");
          } else {
            setError("Error al obtener los datos del usuario");
          }
        });
    };

    fetchUserId();
  }, [userId, session, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prevState) => ({ ...prevState, profilePicture: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data
    axios
      .put(`/api/user/${userId}`, user)
      .then((response) => alert("Perfil actualizado con éxito"))
      .catch((error) => console.error("Error al actualizar el perfil:", error));
  };

  const handleLogout = () => {
    signOut()
      .then(() => {
        window.location.href = '/auth/login';
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
        setError('Error al cerrar sesión');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <label htmlFor="profilePicture" className="text-lg font-medium mb-2">Foto de Perfil</label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Perfil"
              className="w-32 h-32 rounded-full object-cover cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="name" className="block text-lg font-medium mb-2">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname" className="block text-lg font-medium mb-2">Apellido</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="block text-lg font-medium mb-2">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300">
          Guardar Cambios
        </button>
        <button type="button" onClick={handleLogout} className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300">
          Cerrar Sesión
        </button>
      </form>
    </div>
  );
}
