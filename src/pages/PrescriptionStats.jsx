import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllPrescriptions } from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionStats() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllPrescriptions(token);
        const counts = new Map();
        for (const p of data || []) {
          const key = p.id_medicament;
          if (!counts.has(key)) {
            counts.set(key, {
              id_medicament: p.id_medicament,
              nom_commercial: p.nom_commercial,
              total: 0,
            });
          }
          counts.get(key).total += 1;
        }
        const sorted = [...counts.values()].sort((a, b) => b.total - a.total);
        setRanking(sorted);
      } catch (err) {
        console.error("Erreur chargement stats:", err);
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Medicaments du plus au moins prescrit</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {ranking.length === 0 ? (
        <p className="no-data-message">Aucune prescription.</p>
      ) : (
        <table className="prescriptions-table">
          <thead>
            <tr>
              <th>Rang</th>
              <th>Medicament</th>
              <th>Nombre de prescriptions</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((m, i) => (
              <tr key={m.id_medicament}>
                <td>{i + 1}</td>
                <td>{m.nom_commercial}</td>
                <td>{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PrescriptionStats;
