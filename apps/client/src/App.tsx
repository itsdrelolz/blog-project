import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import PostPage from './pages/PostPage'
import NotFoundPage from './pages/NotFoundPage'
import SearchPage from './pages/SearchPage'
import { Route, Routes, useParams } from 'react-router-dom'
import EditPostPage from './pages/EditPostPage'
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'

const PostPageWrapper = () => {
  const { id } = useParams();
  return <PostPage id={id!} />;
};

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth/signup" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/post/:id" element={<PostPageWrapper />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['author', 'admin']}>
                  <CreatePostPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['author', 'admin']}>
                  <EditPostPage />
                </RoleProtectedRoute>
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
