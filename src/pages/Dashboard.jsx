import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1>Bienvenue sur Dashboard</h1>
            {user ? (<p>Bonjour {user.login} !</p>) : (<p>Bonjour !</p>)}

        </>
    );
}

export default Dashboard;
