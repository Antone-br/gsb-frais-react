import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FraisTable from "../component/frais/FraisTable";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h2>Tableau de bord</h2>
      {user ? (
        <p>Bonjour, <strong>{user.prenom_visiteur} {user.nom_visiteur}</strong> !</p>
      ) : (
        <p>Bonjour !</p>
      )}
      <div className="list-group mb-4" style={{ maxWidth: "400px" }}>
        <Link className="list-group-item list-group-item-action" to="/medicaments">Rechercher un médicament</Link>
        <Link className="list-group-item list-group-item-action" to="/prescriptions/toutes">Toutes les prescriptions</Link>
        <Link className="list-group-item list-group-item-action" to="/prescriptions/stats">Dosage le plus prescrit</Link>
      </div>
      <FraisTable />
    </div>
  );
}

export default Dashboard;
