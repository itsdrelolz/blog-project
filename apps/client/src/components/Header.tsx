// Header.tsx
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

<<<<<<< HEAD
          <div className="flex-1">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
            </Link>
          </div>
      
        
          <div className="flex-1 text-center">
            <Link to="/create-post" className="hover:underline mr-4">
              New Post
            </Link>
            <Link to="/profile" className="hover:underline">
              View Profile
            </Link>
          </div>
      
          
          <div className="flex-1 text-right">
            {userIsLoggedIn ? (
              <>
              <button className="hover:underline">Logout</button>
=======
  const handleLogout = () => {
    logout();
    navigate("/auth/login"); 
  };
>>>>>>> 8c04f6828e838fd7659cb7e66264a914d59e8d4e

  return (
    <header>
      <nav className="bg-white shadow p-2 flex items-center">
        <div className="flex-1">
            <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
        </div>

        <div className="flex-1 text-center">
          {isLoggedIn ? (
            <>
            <Link to="/public/home" className="hover:underline mr-4">
            Home
              </Link>
              <Link to="/create-blog" className="hover:underline mr-4">
                New Post
              </Link>
              <Link to="/about" className="hover:underline mr-4">
            About
              </Link>
              <Link to="/profile" className="hover:underline">
                View Profile
              </Link>
            </>
          ) : 
          <> 
          <Link to="/public/home" className="hover:underline mr-4">
            Home
              </Link>
            <Link to="/about" className="hover:underline mr-4">
            About
              </Link>
              </>
}
        </div>

        <div className="flex-1 text-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <Link to="/auth/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;