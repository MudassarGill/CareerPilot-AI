"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchAPI } from "./api";
import { useRouter, usePathname } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    is_verified: boolean;
    profile_completed: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, refresh_token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    refreshUser: async () => { },
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function loadUser() {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userData = await fetchAPI("/auth/me");
                    setUser(userData);
                } catch (e) {
                    console.error("Failed to fetch user, token might be invalid", e);
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                }
            }
            setLoading(false);
        }
        loadUser();
    }, []);

    const login = (token: string, refresh_token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refresh_token);
        setUser(user);
        if (!user.profile_completed) {
            router.push("/profile-setup");
        } else {
            router.push("/dashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/login");
    };

    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const userData = await fetchAPI("/auth/me");
                setUser(userData);
            } catch (e) {
                console.error("Failed to refresh user", e);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
