
import { Routes, Route } from 'react-router-dom'; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import Register from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
const App = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<Register />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
