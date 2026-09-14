import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * Wrapper component that restricts access to only authenticated users.
 * @param {ProtectedRouteProps} props - The component properties.
 * @param {React.ReactNode} props.children - The protected elements to render upon successful authentication.
 * @returns {JSX.Element} The rendered child components, a loading indicator, or a redirection indicator.
 */
export default function ProtectedRoute({ 
    children,
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) { 
        return <Navigate to="/login" replace />
    }

    return children;
}