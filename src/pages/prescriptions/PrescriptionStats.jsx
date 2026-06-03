import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllPrescriptions } from "../../services/prescriptionService";

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
          if (!counts.has(key)) counts.set(key, { id_medicament: p.id_medicament, nom_commercial: p.nom_commercial, total: 0 });
          counts.get(key).total += 1;
        }
        setRanking([...counts.values()].sort((a, b) => b.total - a.total));
      } catch (err) {
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Médicaments du plus au moins prescrit</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/medicaments")}>Retour</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {ranking.length === 0 ? (
        <p className="text-muted">Aucune prescription.</p>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-bordered table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rang</th>
                  <th>Médicament</th>
                  <th>Nombre de prescriptions</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((m, i) => (
                  <tr key={m.id_medicament}>
                    <td><span className="badge text-bg-primary">{i + 1}</span></td>
                    <td>{m.nom_commercial}</td>
                    <td>{m.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrescriptionStats;
