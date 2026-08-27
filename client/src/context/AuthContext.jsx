import { createContext, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function login(email, password) {
        const response = await api.post("/auth/login", {
            email,
            password
        });
        
        const { user } = response.data;

        setUser(user);
    };

    async function register(email, password) {
        const response = await api.post("/auth/register", {
            email, 
            password
        });

        const { user } = response.data;

        setUser(user);
    };

    function logout() {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
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
    return useContext(AuthContext);
 }