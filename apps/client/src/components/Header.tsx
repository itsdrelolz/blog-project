// Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchTerm("");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
    setMenuOpen(false);
  };

  return (
    <header className="bg-gray-100 shadow">
      
      <div className="flex items-center justify-between p-2">
       
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
          </Link>
        </div>

        
        <div className="hidden sm:block flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="flex items-center border rounded overflow-hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title…"
              className="px-2 py-1 w-full focus:outline-none"
            />
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700">
              🔍
            </button>
          </form>
        </div>

        {/* Right section - Navigation */}
        <div className="flex items-center">
          
          <button
            className="sm:hidden p-2 focus:outline-none"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
            </svg>
          </button>

          {/* desktop nav: hidden on mobile */}
          <nav className="hidden sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/create-post" className="hover:underline">New Post</Link>
                <Link to="/about" className="hover:underline">About</Link>
                <Link to="/profile" className="hover:underline">Profile</Link>
                <button onClick={handleLogout} className="hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/about" className="hover:underline">About</Link>
                <Link to="/auth/login" className="hover:underline">Login</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* mobile menu panel */}
      {menuOpen && (
        <div className="sm:hidden border-t bg-white">
          <form onSubmit={handleSearch} className="flex p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title…"
              className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700">
              🔍
            </button>
          </form>
          <div className="flex flex-col p-2 space-y-1">
            {isLoggedIn ? (
              <>
                <Link to="/create-post" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-100 rounded">
                  New Post
                </Link>
                <Link to="/about"       onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-100 rounded">
                  About
                </Link>
                <Link to="/profile"     onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-100 rounded">
                  Profile
                </Link>
                <button onClick={handleLogout} className="text-left px-3 py-2 hover:bg-gray-100 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/about"       onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-100 rounded">
                  About 
                </Link>
                <Link to="/auth/login"  onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-100 rounded">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
