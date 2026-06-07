import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FaShieldAlt className="text-red-500 mr-2" size={28} />
            <Link to="/" className="text-xl font-bold hover:text-gray-300">CyberGuard</Link>
            <span className="text-xs ml-2 bg-red-500 px-2 py-1 rounded">MONITORING</span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-red-400 transition">Dashboard</Link>
            <Link to="/threats" className="hover:text-red-400 transition">Threats</Link>
            <Link to="/alerts" className="hover:text-red-400 transition">Alerts</Link>
            <Link to="/url-checker" className="hover:text-red-400 transition">URL Checker</Link>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live</span>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 py-2">
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link>
          <Link to="/threats" className="block px-4 py-2 hover:bg-gray-700">Threats</Link>
          <Link to="/alerts" className="block px-4 py-2 hover:bg-gray-700">Alerts</Link>
          <Link to="/url-checker" className="block px-4 py-2 hover:bg-gray-700">URL Checker</Link>
        </div>
      )}
    </nav>
  );
}
