import { useNavigate } from "react-router";
import { useAuth } from "../context/authContext";
import { useState } from "react";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        
        setError("");

        try {
            await register(email, password);
            navigate("/meetings");
        } catch (error) {
            setError(
                error.response?.data?.message || "Register Failed"
            );
        }
    }

    return (
        <div>
            <h1>MeetingMate</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">
                    Create Account
                </button>
            </form>
        </div>
    )
}