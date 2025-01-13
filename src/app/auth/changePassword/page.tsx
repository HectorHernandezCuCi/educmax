"use client";

import React, { useState } from "react";

const ChangePasswordForm = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Verify email, Step 2: Verify password, Step 3: Change password
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Email not found");
        return;
      }

      setStep(2); // Move to the next step
      setMessage("Email verified. Please enter your current password.");
    } catch (err) {
      setError("An error occurred while verifying the email.");
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid password");
        return;
      }

      setStep(3); // Move to the final step
      setMessage("Password verified. You can now set a new password.");
    } catch (err) {
      setError("An error occurred while verifying the password.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage("Password updated successfully!");
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setStep(1); // Reset to the initial step
    } catch (err) {
      setError("An error occurred while updating the password.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      {step === 1 && (
        <form onSubmit={handleVerifyEmail}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Verify Email
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyPassword}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Verify Password
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;
