import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { PageShell, Panel, PrimaryButton, TextInput } from "../components/ui";

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
        <PageShell>
            <div className="mx-auto max-w-md pt-16">
                <Panel className="p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">MeetingMate</h1>
                        <p className="mt-2 text-sm text-slate-400">Turn meetings into action</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                                Email
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                                Password
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                {error}
                            </p>
                        )}

                        <PrimaryButton type="submit" disabled={loading} className="w-full">
                            {loading ? "Logging in..." : "Login"}
                        </PrimaryButton>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don't have an account? {" "}
                        <Link to="/register" className="font-medium text-violet-300 hover:text-violet-200">
                            Register
                        </Link>
                    </p>
                </Panel>
            </div>
        </PageShell>
    )
}