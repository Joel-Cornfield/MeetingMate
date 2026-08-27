import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ 
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await api.get("/auth/me");

                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    },[]);

    async function login(
        email: string, 
        password: string
    ) {
        const response = await api.post("/auth/login", {
            email,
            password
        });

        setUser(response.data.user);
    };

    async function register(
        email: string, 
        password: string
    ) {
        const response = await api.post("/auth/register", {
            email, 
            password
        });

        setUser(response.data.user);
    };

    async function logout() {
        await api.post("/auth/logout");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
 }

 export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
 }