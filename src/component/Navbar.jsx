import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logoutUser, user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Accueil
          </Link>
          <Link to="/dashboard" className="navbar-link">
            Tableau de bord
          </Link>
          <Link to="/frais/ajouter" className="navbar-link">
            Ajouter frais
          </Link>
        </div>
        <div className="navbar-auth">
          {user ? (
            <button onClick={logoutUser} className="logout-btn">
              Déconnexion
            </button>
          ) : (
            <Link to="/login" className="navbar-link">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
