import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { searchMedicaments, getFamilles } from "../../services/prescriptionService";

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

    const load = async () => {
      try {
        const [meds, fams] = await Promise.all([
          searchMedicaments("", null, token),
          getFamilles(token),
        ]);
        setMedicaments(meds || []);
        setFamilles(fams || []);
      } catch {
        setError("Erreur lors du chargement.");
      } finally {
        setLoading(false);
      }
    };

    load();

  }, [token]);

  const filtered = medicaments.filter((m) => {
    const matchNom = m.nom_commercial.toLowerCase().includes(nom.trim().toLowerCase());
    const matchFamille = !idFamille || String(m.id_famille) === idFamille;
    return matchNom && matchFamille;
  });

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Recherche de médicaments</h2>
      </div>

      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Nom commercial</label>
            <input
              type="text"
              className="form-control"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Rechercher un médicament..."
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Famille</label>
            <select className="form-select" value={idFamille} onChange={(e) => setIdFamille(e.target.value)}>
              <option value="">-- Toutes les familles --</option>
              {familles.map((f) => (
                <option key={f.id_famille} value={f.id_famille}>{f.lib_famille}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {filtered.length === 0 ? (
        <p className="text-muted">Aucun médicament trouvé.</p>
      ) : (
        <>
          <p className="text-muted">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</p>
          <div className="card">
            <div className="card-body p-0">
              <table className="table table-bordered table-striped table-hover mb-0">
                <thead className="table-light">
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
                        <Link className="btn btn-outline-primary btn-sm" to={`/prescriptions/medicament/${med.id_medicament}`}>
                          Détail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MedicamentSearch;
