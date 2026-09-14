import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Represents the authenticated user profile.
 * @property {string} id - Unique identifier for the user.
 * @property {string} email - Registered email address for the user.
 */
interface User {
    id: string;
    email: string;
}

/**
 * Shape of the context values provided by the AuthProvider.
 * @property {User|null} user - The currently authenticated user object, or null if logged out.
 * @property {boolean} loading - True if the initial session validation request is still pending. 
 * @property {function} login - Triggers user login with credentials.
 * @property {function} register - Triggers account registration and auto-login.
 * @property {function} logout - Invalidates the session and resets application auth state.
 */
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

/**
 * React Context object initialized for handling global authentication states.
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Context wrapper component that manages user persistence and global authentication states.
 * @param {object} props - Component properties.
 * @param {React.ReactNode} props.children - Target children components requiring context visibility.
 * @returns {JSX.Element} The wrapper component exposing authentication methods and reactive state.
 */
export function AuthProvider({ 
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Verifies the user session status with the API backend on mounting.
         */
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

    /**
     * Authenticates a user using email and password credentials.
     * @param {string} email - The user's account email.
     * @param {string} password - The user's account password.
     * @returns {Promise<void>} Resolves if validation succeeds.
     */
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

    /**
     * Creates a new user record and sets the active authentication scope.
     * @param {string} email - The new account registration email.
     * @param {string} password - The new account password.
     * @returns {Promise<void>} Resolves when registration succeeds.
     */
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

    /**
     * Requests remote logout termination and resets the client user record context.
     * @returns {Promise<void>} Resolves once state tear-down is complete.
     */
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

/**
 * Access hook retrieving the nearest surrounding AuthContext values.
 * @throws {Error} Occurs when executing this hook outside a structural AuthProvider component tree.
 * @returns {AuthContextType} The active authentication context methods and state values.
 */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}