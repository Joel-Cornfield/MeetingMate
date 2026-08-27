import { useAuth } from "../context/AuthContext";

export default function Meetings() {
    const { user, logout } = useAuth();

    async function handleLogout() {
        await logout();
    }

    return (
        <div>
            <h1>MeetingMate</h1>

            <h2>Meetings</h2>

            <p>Logged in as: {user?.email}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}


