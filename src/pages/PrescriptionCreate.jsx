import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllMedicaments,
  getDosages,
  getTypesIndividu,
  createPrescription,
} from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionCreate() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetMedicament = searchParams.get("medicament") || "";

  const [medicaments, setMedicaments] = useState([]);
  const [dosages, setDosages] = useState([]);
  const [typesIndividu, setTypesIndividu] = useState([]);

  const [idMedicament, setIdMedicament] = useState(presetMedicament);
  const [idDosage, setIdDosage] = useState("");
  const [idTypeIndividu, setIdTypeIndividu] = useState("");
  const [posologie, setPosologie] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [meds, dos, ti] = await Promise.all([
          getAllMedicaments(token),
          getDosages(token),
          getTypesIndividu(token),
        ]);
        setMedicaments(meds || []);
        setDosages(dos || []);
        setTypesIndividu(ti || []);
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Erreur lors du chargement des donnees.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createPrescription(
        {
          id_medicament: parseInt(idMedicament, 10),
          id_dosage: parseInt(idDosage, 10),
          id_type_individu: parseInt(idTypeIndividu, 10),
          posologie: posologie || null,
        },
        token,
      );
      setSuccess("Prescription ajoutee.");
      setIdDosage("");
      setIdTypeIndividu("");
      setPosologie("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Ajouter une prescription</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="prescriptions-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicament</label>
          <select
            value={idMedicament}
            onChange={(e) => setIdMedicament(e.target.value)}
            required
          >
            <option value="">-- Choisir un medicament --</option>
            {medicaments.map((m) => (
              <option key={m.id_medicament} value={m.id_medicament}>
                {m.nom_commercial}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dosage</label>
          <select
            value={idDosage}
            onChange={(e) => setIdDosage(e.target.value)}
            required
          >
            <option value="">-- Choisir un dosage --</option>
            {dosages.map((d) => (
              <option key={d.id_dosage} value={d.id_dosage}>
                {d.qte_dosage} {d.unite_dosage}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Type individu</label>
          <select
            value={idTypeIndividu}
            onChange={(e) => setIdTypeIndividu(e.target.value)}
            required
          >
            <option value="">-- Choisir un type --</option>
            {typesIndividu.map((ti) => (
              <option key={ti.id_type_individu} value={ti.id_type_individu}>
                {ti.lib_type_individu}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Posologie</label>
          <input
            type="text"
            value={posologie}
            onChange={(e) => setPosologie(e.target.value)}
            placeholder="Posologie (optionnel, max 100 car.)"
            maxLength={100}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Enregistrement..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PrescriptionCreate;
