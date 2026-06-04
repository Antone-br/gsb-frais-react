import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllMedicaments, getPrescriptions } from "../../services/prescriptionService";

function PrescriptionStats() {
  const { token } = useAuth();
  const { idMedicament } = useParams();
  const navigate = useNavigate();

  const [medicaments, setMedicaments] = useState([]);
  const [selectedId, setSelectedId] = useState(idMedicament || "");
  const [allDosages, setAllDosages] = useState([]);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const meds = await getAllMedicaments(token);
        setMedicaments(meds || []);
      } catch {
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!selectedId || !token) {
      setAllDosages([]);
      setTotalPrescriptions(0);
      setSelectedMedicament(null);
      return;
    }
    const load = async () => {
      try {
        const rows = await getPrescriptions(parseInt(selectedId), token);
        setSelectedMedicament(medicaments.find((m) => String(m.id_medicament) === String(selectedId)) || null);

        const counts = new Map();
        for (const p of rows || []) {
          if (!counts.has(p.id_dosage)) {
            counts.set(p.id_dosage, { id_dosage: p.id_dosage, qte_dosage: p.qte_dosage, unite_dosage: p.unite_dosage, total: 0 });
          }
          counts.get(p.id_dosage).total += 1;
        }

        const sorted = [...counts.values()].sort((a, b) => b.total - a.total);
        const total = sorted.reduce((acc, d) => acc + d.total, 0);
        const maxCount = sorted.length > 0 ? sorted[0].total : 0;

        setAllDosages(sorted.map((d) => ({
          ...d,
          percent: total > 0 ? Math.round((d.total * 100) / total * 10) / 10 : 0,
          is_top: d.total === maxCount,
        })));
        setTotalPrescriptions(total);
      } catch {
        setError("Erreur lors du chargement des stats.");
      }
    };
    load();
  }, [selectedId, token, medicaments]);

  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    navigate(id ? `/prescriptions/stats/${id}` : "/prescriptions/stats");
  };

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Statistique — Dosage le plus prescrit</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/medicaments")}>Retour recherche</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3">
        <div className="row g-2 mb-3">
          <div className="col-md-9">
            <label className="form-label">Médicament</label>
            <select className="form-select" value={selectedId} onChange={handleSelect}>
              <option value="">Choisir un médicament</option>
              {medicaments.map((m) => (
                <option key={m.id_medicament} value={m.id_medicament}>{m.nom_commercial}</option>
              ))}
            </select>
          </div>
        </div>

        {!selectedId ? (
          <p className="mb-0 text-muted">Sélectionnez un médicament.</p>
        ) : allDosages.length === 0 ? (
          <p className="mb-0 text-muted">Aucune prescription pour ce médicament.</p>
        ) : (
          <>
            <p className="mb-2">
              <strong>{selectedMedicament?.nom_commercial}</strong>
              <span className="text-muted small ms-2">{totalPrescriptions} prescription(s)</span>
            </p>
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Dosage</th>
                  <th>Prescriptions</th>
                  <th>Part</th>
                </tr>
              </thead>
              <tbody>
                {allDosages.map((d, i) => (
                  <tr key={d.id_dosage} className={d.is_top ? "table-success" : ""}>
                    <td>{i + 1}</td>
                    <td>
                      {d.qte_dosage} fois par {d.unite_dosage.toLowerCase()}
                    </td>
                    <td>{d.total}</td>
                    <td style={{ minWidth: "120px" }}>
                      <div className="progress" style={{ height: "18px" }}>
                        <div className="progress-bar bg-primary" style={{ width: `${d.percent}%` }}>
                          {d.percent}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default PrescriptionStats;
