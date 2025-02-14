import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    token: null,
    login: (token) => {}, // Accepts only the token
    logout: () => {},
    isLoading: true, // Add a loading state
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true); // Initial loading state

    useEffect(() => {
        // Persist token to localStorage and update isLoggedIn
        if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null); // Clear user data on logout
        }
    }, [token]);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                setIsLoading(true); // Set loading to true while fetching

                try {
                    const response = await fetch('/api/users/me', { // Or your actual endpoint
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
                    }

                    const userData = await response.json();
                    setUser(userData.user); // Assuming your response has a 'user' property
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    logout(); // Handle error - token expired, etc.
                } finally {
                    setIsLoading(false); // Set loading to false after fetch
                }
            } else {
              setIsLoading(false); // If no token, not loading
            }
        };

        fetchUser();
    }, [token]);

    const login = (token) => {
        setToken(token); // Triggers useEffect to fetch user and update localStorage
    };

    const logout = () => {
        setToken(null);  // Triggers useEffect to clear storage and user data
    };

    const value = {
        isLoggedIn,
        user,
        token,
        login,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;