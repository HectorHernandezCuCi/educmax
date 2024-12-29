"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProfile() {
  const { userId } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    profilePicture: "",
    age: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (response.ok) {
          const { user } = await response.json();
          setFormData({
            name: user.name || "",
            lastname: user.lastname || "",
            profilePicture: user.profilePicture || "",
            age: user.age || "",
            email: user.email || "",
            password: "",
          });
        } else {
          console.error("Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    const password = prompt("Please enter your password to change email:");
    setFormData({ ...formData, email: newEmail, password });
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: base64String }),
          });
          const data = await response.json();
          setFormData({ ...formData, profilePicture: data.url });
        } catch (error) {
          console.error("Error uploading profile picture:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const notifyProfilePage = () => {
    const event = new CustomEvent("profileUpdated");
    window.dispatchEvent(event);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        notifyProfilePage(); // Notify profile page about the update
        // Fetch updated user data
        const updatedResponse = await fetch(`/api/user/${userId}`);
        if (updatedResponse.ok) {
          const { user } = await updatedResponse.json();
          setFormData({
            name: user.name || "",
            lastname: user.lastname || "",
            profilePicture: user.profilePicture || "",
            age: user.age || "",
            email: user.email || "",
            password: "",
          });
          // Redirect to profile page
          router.push(`/profile/${userId}`);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <form
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="text-center">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleProfilePictureChange}
        />
        {formData.profilePicture && (
          <img
            src={formData.profilePicture}
            alt="Profile"
            onClick={handleProfilePictureClick}
            className="cursor-pointer w-24 h-24 object-cover border-2 border-gray-300 rounded-full mx-auto hover:border-blue-500"
          />
        )}
        <p className="mt-2 text-sm text-gray-500">
          Click to change profile picture
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Lastname
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
}
