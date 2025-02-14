import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Set loading to true

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
                throw new Error(
                    `API error ${response.status}: ${errorData.message || response.statusText}`,
                );
            }

            const data = await response.json();
            console.log("Login successful", data);

            localStorage.setItem("token", data.token);

            setTimeout(() => navigate("/public/home"), 1500); // Redirect to home page after successful login
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
                        className={`w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md transition-colors mt-2 ${isLoading? 'opacity-75 cursor-not-allowed': ''}`} // Disable button while loading
                        disabled={isLoading}
                    >
                        {isLoading? 'Logging in...': 'Login'} 
                    </button>

                    {error && <div className="text-red-500 mt-2">{error}</div>} {/* Improved error display */}

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