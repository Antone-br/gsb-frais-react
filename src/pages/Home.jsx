import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="container mt-4">
      <h1 className="mb-1">GSB — Prescriptions</h1>

      {user ? (
        <>
          <p className="text-muted mb-4">Bonjour, <strong>{user.prenom_visiteur} {user.nom_visiteur}</strong>.</p>
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-primary" to="/medicaments">Médicaments</Link>
            <Link className="btn btn-outline-primary" to="/prescriptions/toutes">Toutes les prescriptions</Link>
            <Link className="btn btn-outline-secondary" to="/prescriptions/stats">Dosage le plus prescrit</Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-muted mb-4">Bienvenue sur l'application GSB. Connectez-vous pour accéder à votre espace.</p>
          <Link className="btn btn-primary" to="/login">Se connecter</Link>
        </>
      )}
    </div>
  );
}

export default Home;
