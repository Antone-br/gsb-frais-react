import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllMedicaments,
  getPrescriptions,
  deletePrescription,
} from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionDelete() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [medicaments, setMedicaments] = useState([]);
  const [idMedicament, setIdMedicament] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPresc, setLoadingPresc] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const meds = await getAllMedicaments(token);
        setMedicaments(meds || []);
      } catch (err) {
        console.error("Erreur chargement medicaments:", err);
        setError("Erreur lors du chargement des medicaments.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMedicaments();
  }, [token]);

  const handleMedicamentChange = async (e) => {
    const id = e.target.value;
    setIdMedicament(id);
    setPrescriptions([]);
    setSuccess("");
    setError("");
    if (!id) return;

    setLoadingPresc(true);
    try {
      const data = await getPrescriptions(id, token);
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Erreur chargement prescriptions:", err);
      setError("Erreur lors du chargement des prescriptions.");
    } finally {
      setLoadingPresc(false);
    }
  };

  const handleDelete = async (presc) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;

    try {
      await deletePrescription(
        {
          id_medicament: parseInt(idMedicament, 10),
          id_dosage: presc.id_dosage,
          id_type_individu: presc.id_type_individu,
        },
        token,
      );
      setPrescriptions((prev) =>
        prev.filter(
          (p) =>
            !(
              p.id_dosage === presc.id_dosage &&
              p.id_type_individu === presc.id_type_individu
            ),
        ),
      );
      setSuccess("Prescription supprimee.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Supprimer une prescription</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Medicament</label>
          <select value={idMedicament} onChange={handleMedicamentChange}>
            <option value="">-- Choisir un medicament --</option>
            {medicaments.map((m) => (
              <option key={m.id_medicament} value={m.id_medicament}>
                {m.nom_commercial}
              </option>
            ))}
          </select>
        </div>
      </form>

      {loadingPresc && <b>Chargement...</b>}

      {idMedicament && !loadingPresc && prescriptions.length === 0 && (
        <p className="no-data-message">Aucune prescription pour ce medicament.</p>
      )}

      {prescriptions.length > 0 && (
        <table className="prescriptions-table">
          <thead>
            <tr>
              <th>Type individu</th>
              <th>Dosage</th>
              <th>Posologie</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((presc) => (
              <tr key={`${presc.id_dosage}-${presc.id_type_individu}`}>
                <td>{presc.lib_type_individu}</td>
                <td>{presc.qte_dosage} {presc.unite_dosage}</td>
                <td>{presc.posologie || "—"}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(presc)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PrescriptionDelete;
