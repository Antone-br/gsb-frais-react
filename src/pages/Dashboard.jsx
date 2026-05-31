import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Tableau de bord</h1>
      {user ? (
        <p>Bonjour {user.prenom_visiteur} {user.nom_visiteur} !</p>
      ) : (
        <p>Bonjour !</p>
      )}
      <ul>
        <li><Link to="/medicaments">Rechercher un médicament</Link></li>
        <li><Link to="/prescriptions/toutes">Toutes les prescriptions</Link></li>
        <li><Link to="/prescriptions/stats">Dosage le plus prescrit</Link></li>
      </ul>
    </>
  );
}

export default Dashboard;
