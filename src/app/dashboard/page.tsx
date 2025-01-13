"use client";

import { signOut, useSession } from "next-auth/react";

function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <p className="text-white text-xl">Loading...</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <p className="text-white text-xl">You are not logged in</p>
      </section>
    );
  }

  const { user } = session;

  return (
    <section className="h-[calc(100vh-7rem)] flex flex-col justify-center items-center">
      <div>
        <h1 className="text-white text-5xl">Dashboard</h1>
        <p className="text-white text-lg mt-2">
          Welcome, <span className="font-bold">{user.name}</span>!
        </p>
        <p className="text-gray-300 text-sm">
          Email: <span className="font-medium">{user.email}</span>
        </p>
        <button
          className="bg-white text-black px-4 py-2 rounded-md mt-4"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default DashboardPage;
