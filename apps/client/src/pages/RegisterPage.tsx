import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const validateInputs = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          name: name.trim(),
          role: "user" // Default role for new users
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `API error ${response.status}: ${response.statusText}`);
      }

      setSuccess(true);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">Registration successful!</div>
            <div className="text-gray-600">Redirecting to login page...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="small" text="" />
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;

