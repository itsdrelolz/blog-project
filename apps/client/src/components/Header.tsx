import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";


const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); 
    };

    checkAuth(); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };


  if (isLoggedIn === null) {
    return (
      <header>
        <nav className="bg-white shadow p-2 flex items-center">
          <div className="flex-1">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <p>Loading...</p> 
          </div>
          <div className="flex-1 text-right">
            <p>Loading...</p> 
          </div>
        </nav>
      </header>
    );
  }
  return (
    <header>
      <nav className="bg-white shadow p-2 flex items-center">
        <div className="flex-1">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-16 md:w-20 h-auto" />
          </Link>
        </div>

        <div className="flex-1 text-center">
          {isLoggedIn && (
            <>
              <Link to="/create-blog" className="hover:underline mr-4">
                New Post
              </Link>
              <Link to="/profile" className="hover:underline">
                View Profile
              </Link>
            </>
          )}
        </div>

        <div className="flex-1 text-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <Link to="auth/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
