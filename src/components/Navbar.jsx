// import React from "react";
// import { NavLink,} from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-800 p-4 text-white">
//       <div className="container mx-auto flex justify-between items-center">
//         <NavLink to="/" className="text-2xl font-bold">CP Tracker</NavLink>
//         <div className="space-x-4">
//           <NavLink to="/" className="hover:text-gray-300 font-semibold" 

          
//           style={({ isActive }) => ({
//             color: isActive ? 'white' : 'gray',
//           })}
          
//           >Home</NavLink>
//           <NavLink to="/details/leetcode" className="hover:text-gray-300 font-semibold"
            
//             style={({ isActive }) => ({
//               color: isActive ? 'white' : 'gray',
//             })}

//           >LeetCode</NavLink>
//           <NavLink to="/details/codeforces" className="hover:text-gray-300 font-semibold"
            
//             style={({ isActive }) => ({
//               color: isActive ? 'white' : 'gray',
//             })}

//           >Codeforces</NavLink>
//           <NavLink to="/compare/leetcode" className="hover:text-gray-300 font-semibold"
          
//           style={({ isActive }) => ({
//             color: isActive ? 'white' : 'gray',
//           })}

//           >Compare</NavLink>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold">CP Tracker</NavLink>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-4">
          {["Home", "LeetCode", "Codeforces", "Compare"].map((item, index) => (
            <NavLink
              key={index}
              to={`/${item === "Home" ? "" : `details/${item.toLowerCase()}`}`}
              className={({ isActive }) =>
                `font-semibold transition-colors ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-300"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden h-screen w-[40%]  flex flex-col z-10 absolute items-center right-0 bg-gray-900 p-4">
          {["Home", "LeetCode", "Codeforces", "Compare"].map((item, index) => (
            <NavLink
              key={index}
              to={`/${item === "Home" ? "" : `details/${item.toLowerCase()}`}`}
              className="py-2 text-gray-300 hover:text-white font-semibold"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
