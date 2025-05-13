// Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  
  const [searchTerm, setSearchTerm] = useState("");

  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchTerm(""); 
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header>
      <nav className="bg-gray-100 shadow p-2 flex items-center">
        {/* Logo / Home */}
        <div className="flex-1">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
          </Link>
        </div>

        {/* Search bar (visible to everyone) */}
        <div className="flex-1 text-center">
          <form
            onSubmit={handleSearch}
            className="inline-flex items-center border rounded overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts…"
              className="px-2 py-1 w-48 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              🔍
            </button>
          </form>
        </div>

        {/* Nav links */}
        <div className="flex-1 text-right">
          {isLoggedIn ? (
            <>
              <Link to="/create-post" className="hover:underline mr-4">
                New Post
              </Link>
              <Link to="/about" className="hover:underline mr-4">
                About
              </Link>
              <Link to="/profile" className="hover:underline mr-4">
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about" className="hover:underline mr-4">
                About me
              </Link>
              <Link to="/auth/login" className="hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
