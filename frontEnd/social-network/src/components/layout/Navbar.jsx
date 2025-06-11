import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">SocialNetwork</Link>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hi, {user.name}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 text-blue-600 hover:underline">Login</Link>
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
