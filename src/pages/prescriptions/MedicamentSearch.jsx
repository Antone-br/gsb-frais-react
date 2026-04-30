import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllMedicaments, getFamilles } from "../../services/prescriptionService";
import "../../styles/Prescriptions.css";

function MedicamentSearch() {
  const { token } = useAuth();

  const [nom, setNom] = useState("");
  const [idFamille, setIdFamille] = useState("");
  const [familles, setFamilles] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([getAllMedicaments(token), getFamilles(token)])
      .then(([meds, fams]) => {
        setMedicaments(meds || []);
        setFamilles(fams || []);
      })
      .catch((err) => {
        console.error("Erreur chargement:", err);
        setError("Erreur lors du chargement.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    const q = nom.trim().toLowerCase();
    return medicaments.filter((m) => {
      const matchNom = !q || (m.nom_commercial || "").toLowerCase().includes(q);
      const matchFamille = !idFamille || String(m.id_famille) === String(idFamille);
      return matchNom && matchFamille;
    });
  }, [medicaments, nom, idFamille]);

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Recherche de Medicaments</h2>
      </div>

      <div className="search-form">
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
      </div>

      {error && <div className="error-message">{error}</div>}

      {filtered.length === 0 ? (
        <p className="no-data-message">Aucun medicament trouve.</p>
      ) : (
        <>
          <p className="results-count">
            {filtered.length} resultat{filtered.length > 1 ? "s" : ""}
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
              {filtered.map((med) => (
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

export default MedicamentSearch;
