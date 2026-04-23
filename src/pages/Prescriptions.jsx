import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchMedicaments, getFamilles } from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function Prescriptions() {
  const { token } = useAuth();

  const [nom, setNom] = useState("");
  const [idFamille, setIdFamille] = useState("");
  const [familles, setFamilles] = useState([]);
  const [medicaments, setMedicaments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getFamilles(token)
      .then((data) => setFamilles(data || []))
      .catch((err) => console.error("Erreur chargement familles:", err));
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await searchMedicaments(nom, idFamille || null, token);
      setMedicaments(data || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Recherche de Medicaments</h2>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Nom commercial</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Rechercher un medicament..."
          />
        </div>

        <div className="form-group">
          <label>Famille</label>
          <select value={idFamille} onChange={(e) => setIdFamille(e.target.value)}>
            <option value="">-- Toutes les familles --</option>
            {familles.map((f) => (
              <option key={f.id_famille} value={f.id_famille}>
                {f.lib_famille}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {medicaments !== null && medicaments.length === 0 && (
        <p className="no-data-message">Aucun medicament trouve.</p>
      )}

      {medicaments !== null && medicaments.length > 0 && (
        <>
          <p className="results-count">
            {medicaments.length} resultat{medicaments.length > 1 ? "s" : ""}
            {medicaments.length === 150 && " (limite atteinte)"}
          </p>
          <table className="prescriptions-table">
            <thead>
              <tr>
                <th>Nom commercial</th>
                <th>Famille</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medicaments.map((med) => (
                <tr key={med.id_medicament}>
                  <td>{med.nom_commercial}</td>
                  <td>{med.lib_famille || "—"}</td>
                  <td>
                    <Link
                      to={`/prescriptions/medicament/${med.id_medicament}`}
                      className="detail-link"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Prescriptions;
