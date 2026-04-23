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
          <div className="navbar-dropdown">
            <button type="button" className="navbar-link navbar-dropdown-toggle">
              Prescriptions ▾
            </button>
            <div className="navbar-dropdown-menu">
              <Link to="/medicaments" className="navbar-dropdown-item">
                Rechercher
              </Link>
              <Link to="/prescriptions/toutes" className="navbar-dropdown-item">
                Toutes les prescriptions
              </Link>
              <Link to="/prescriptions/ajouter" className="navbar-dropdown-item">
                Ajouter
              </Link>
              <Link to="/prescriptions/stats" className="navbar-dropdown-item">
                Dosage le plus prescrit
              </Link>
            </div>
          </div>
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
