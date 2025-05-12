import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 


const Header = () => {
    const userIsLoggedIn: boolean = false; 
    return (
        <header>
        <nav className="bg-white shadow p-2 flex items-center">

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

              </>
            ) : (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            )}
            
          </div>
        </nav>
      </header>
      
    );
};

export default Header;