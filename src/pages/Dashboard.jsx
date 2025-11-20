import { useAuth } from "../context/AuthContext";
import FraisTable from '../component/FraisTable';


function Dashboard() {
    const { user } = useAuth();

    return (
        <>
            <h1>Bienvenue sur Dashboard</h1>
            {user ? (<p>Bonjour {user.prenom_visiteur} {user.nom_visiteur} !</p>) : (<p>Bonjour !</p>)}
            <FraisTable/>

        </>
    );
}

export default Dashboard;
