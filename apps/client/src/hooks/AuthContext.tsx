// hooks/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

import { GetUserData } from '@blog-project/shared-types';

export interface AuthContextType {
    isLoggedIn: boolean;
    user: GetUserData | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    user: null,
    token: null,
    login: () => {}, 
    logout: () => {},
    isLoading: true, 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null); 
        }
    }, [token]);

    const login = useCallback((newToken: string) => {
        setToken(newToken);
    }, [setToken]);

    const logout = useCallback(() => {
        setToken(null);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                setIsLoading(true);
                try {
                    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/me', { 
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.warn(`Fetch user failed with status: ${response.status}`);
                        logout();
                        return; 
                    }

                    const userData = await response.json();
                    setUser(userData.user); 
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    logout();
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false); 
            }
        };

        fetchUser();
    }, [token, logout]);

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