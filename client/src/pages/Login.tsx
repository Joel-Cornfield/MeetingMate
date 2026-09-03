import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: React.SubmitEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/meetings");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || "Login Failed"
                );
            } else {
                setError("Login Failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>MeetingMate</h1>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>
        </div>
    )
}