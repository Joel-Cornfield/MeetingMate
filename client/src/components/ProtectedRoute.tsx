import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

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