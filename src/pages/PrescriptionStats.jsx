import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllMedicaments, getTopDosages } from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionStats() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [medicaments, setMedicaments] = useState([]);
  const [selectedMedicament, setSelectedMedicament] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const data = await getAllMedicaments(token);
        setMedicaments(data || []);
      } catch (err) {
        console.error("Erreur chargement medicaments:", err);
      }
    };
    if (token) fetchMedicaments();
  }, [token]);

  const handleMedicamentChange = async (e) => {
    const idMed = e.target.value;
    setSelectedMedicament(idMed);
    setStats(null);
    setError("");

    if (!idMed) return;

    setLoading(true);
    try {
      const data = await getTopDosages(idMed, token);
      setStats(data);
    } catch (err) {
      console.error("Erreur chargement stats:", err);
      setError("Erreur lors du chargement des statistiques.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Statistiques des Dosages</h2>
        <button className="back-button" onClick={() => navigate("/prescriptions")}>
          Retour
        </button>
      </div>

      <div className="form-group">
        <label>Selectionnez un medicament</label>
        <select
          className="stats-select"
          value={selectedMedicament}
          onChange={handleMedicamentChange}
        >
          <option value="">-- Choisir un medicament --</option>
          {medicaments.map((med) => (
            <option key={med.id_medicament} value={med.id_medicament}>
              {med.nom_commercial}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && <b>Chargement...</b>}

      {!selectedMedicament && !loading && (
        <p className="no-data-message">
          Selectionnez un medicament pour afficher les statistiques.
        </p>
      )}

      {stats && !loading && (
        <>
          {stats.totalPrescriptions === 0 ? (
            <div>
              <p className="no-data-message">
                Aucune prescription pour{" "}
                <strong>{stats.medicament?.nom_commercial}</strong>.
              </p>
              <Link
                to={`/prescriptions/${selectedMedicament}`}
                className="detail-link"
              >
                Voir le detail du medicament
              </Link>
            </div>
          ) : (
            <div>
              <div className="stats-info">
                <strong>{stats.medicament?.nom_commercial}</strong> —{" "}
                {stats.totalPrescriptions} prescription(s) au total
              </div>

              <h3>
                Dosage(s) le(s) plus prescrit(s)
                {stats.topDosages.length > 1 && (
                  <span className="ex-aequo-badge">Ex aequo</span>
                )}
              </h3>

              <table className="prescriptions-table">
                <thead>
                  <tr>
                    <th>Dosage</th>
                    <th>Nombre</th>
                    <th>Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topDosages.map((dosage) => (
                    <tr key={dosage.id_dosage}>
                      <td>
                        {dosage.qte_dosage} {dosage.unite_dosage}
                      </td>
                      <td>{dosage.total}</td>
                      <td>{dosage.percent} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PrescriptionStats;
