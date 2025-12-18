import React, { createContext, useContext, useState, useEffect, ReactNode, Children } from "react";
import { setToken, removeToken } from "../api/api.js";
import {authApi} from "../api/api.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const data = await authApi.getProfile();
                    // Handle response structure (if user is nested or flat)
                    setUser(data.user || data);
                } catch (error) {
                    // Token invalid or expired
                    console.error("Authentication error:", error);
                    removeToken();
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authApi.login(email, password);
        setUser(data.user || data);
    };

    const register = async (username, email, password) => {
        const data = await authApi.signup(username, email, password);
        if (data.token) {
            setToken(data.token);
            setUser(data.user || data);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Even if logout fails on server, clear local state
        }
        removeToken();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const data = await authApi.getProfile();
            setUser(data.user || data);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};