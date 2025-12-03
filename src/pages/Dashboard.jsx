import { useAuth } from "../context/AuthContext";
import FraisTable from '../component/FraisTable';


function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1>Bienvenue sur Dashboard</h1>
            <h2>Login with valid credentials</h2>
            {user ? (<p>Bonjour {user.prenom_visiteur} {user.nom_visiteur} !</p>) : (<p>Bonjour !</p>)}
            <FraisTable/>

        </>
    );
}

export default Dashboard;
