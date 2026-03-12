"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, User } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on mount
        const initAuth = async () => {
            const token = authService.getToken();
            const savedUser = authService.getUser();

            if (token && savedUser) {
                try {
                    // Verify token is still valid
                    const response = await apiClient.getProfile();
                    setUser(response.data.user);
                } catch (error) {
                    // Token invalid, clear auth
                    authService.logout();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiClient.login(email, password);
            const { token, user, requiresOnboarding } = response.data;

            authService.setAuth(token, user);
            setUser(user);
            toast.success(`Welcome back, ${user.name}!`);

            // Redirect based on onboarding status
            if (requiresOnboarding) {
                router.push("/onboarding");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
            // Error already handled by interceptor
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
