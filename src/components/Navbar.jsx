import React from "react";
import { NavLink,} from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold">CP Tracker</NavLink>
        <div className="space-x-4">
          <NavLink to="/" className="hover:text-gray-300 font-semibold" 

          
          style={({ isActive }) => ({
            color: isActive ? 'white' : 'gray',
          })}
          
          >Home</NavLink>
          <NavLink to="/details/leetcode" className="hover:text-gray-300 font-semibold"
            
            style={({ isActive }) => ({
              color: isActive ? 'white' : 'gray',
            })}

          >LeetCode</NavLink>
          <NavLink to="/details/codeforces" className="hover:text-gray-300 font-semibold"
            
            style={({ isActive }) => ({
              color: isActive ? 'white' : 'gray',
            })}

          >Codeforces</NavLink>
          <NavLink to="/compare/leetcode" className="hover:text-gray-300 font-semibold"
          
          style={({ isActive }) => ({
            color: isActive ? 'white' : 'gray',
          })}

          >Compare</NavLink>
        </div>
      </div>
    </nav>
  );
}
