import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mt-6">Competitive Programming Tracker</h1>
      <p className="text-gray-400 mt-2">Select a platform to view user stats</p>

      <div className="mt-8 flex gap-6">
        <button
          className="p-6 text-xl font-semibold rounded-xl shadow-md bg-yellow-400 text-gray-900 hover:scale-105 transition"
          onClick={() => navigate("/details/leetcode")}
        >
          LeetCode
        </button>
        <button
          className="p-6 text-xl font-semibold rounded-xl shadow-md bg-blue-500 hover:scale-105 transition"
          onClick={() => navigate("/details/codeforces")}
        >
          Codeforces
        </button>
      </div>
    </div>
  );
}
