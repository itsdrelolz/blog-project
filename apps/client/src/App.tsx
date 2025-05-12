import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import CreatePostPage from './pages/createPostPage'
const App = () => {
        
  
        return (
              <div className="flex flex-col min-h-screen">
                <Header />
                
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/create-post" element={<CreatePostPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
        );
      }
    
export default App;