import { Link } from "react-router-dom"
import { BrowserRouter } from "react-router-dom"
export default function Navigation() { 


    return ( 
        <BrowserRouter>
        <nav> 
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/create-blog">Create Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
                <div className="search">
                <label htmlFor="searchBar">Search</label>
                <input type="search" name="search-bar" id="searchBar" />
                </div>
        </nav>
        </BrowserRouter>
    )
}