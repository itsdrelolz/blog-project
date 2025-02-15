import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();
  const { login, isLoggedIn} = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
        navigate('/public/home');
    }
}, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password');
        return;
      }

      const data = await response.json();
      const token = data.token;

      console.log("Login successful", data);

      if (token) {
        login(token);
        navigate("/public/home");
      } else {
        setError("Login failed: No token received");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md transition-colors mt-2 ${isLoading? 'opacity-75 cursor-not-allowed': ''}`}
            disabled={isLoading}
          >
            {isLoading? 'Logging in...': 'Login'}
          </button>

          {error && <div className="text-red-500 mt-2">{error}</div>}

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-green-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;