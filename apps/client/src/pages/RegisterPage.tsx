import { useState } from "react";
import React from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error ${response.status}: ${errorData.message || response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Signup successful", data);

      localStorage.setItem("token", data.token);

      setSuccess(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setError((error as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-md shadow-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
          <div>
            <input
              type="text"
              placeholder="Display Name"
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md transition-colors mt-2"
            >
              Signup
            </button>

            {error && <div style={{ color: "red" }}>{error}</div>}
            {success && (
              <div style={{ color: "green" }}>Signup successful!</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
