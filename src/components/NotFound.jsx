import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mt-6">404 - Page Not Found</h1>
      <p className="text-gray-400 mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline"> Go back to Home</Link>
    </div>
  );
}
