import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logoutUser, user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">GSBfrais</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/medicaments">Médicaments</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Prescriptions
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/prescriptions/toutes">Toutes les prescriptions</Link></li>
                <li><Link className="dropdown-item" to="/prescriptions/ajouter">Ajouter</Link></li>
                <li><Link className="dropdown-item" to="/prescriptions/stats">Dosage le plus prescrit</Link></li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={logoutUser}>
                  Déconnexion
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Se connecter</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
