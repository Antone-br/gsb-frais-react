import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllMedicaments,
  getPrescriptions,
  getDosages,
  getTypesIndividu,
  updatePrescription,
} from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionModify() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetMed = searchParams.get("medicament");
  const presetDosage = searchParams.get("dosage");
  const presetType = searchParams.get("type");

  const [medicaments, setMedicaments] = useState([]);
  const [dosages, setDosages] = useState([]);
  const [typesIndividu, setTypesIndividu] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [idMedicament, setIdMedicament] = useState("");
  const [prescKey, setPrescKey] = useState("");
  const [oldIdDosage, setOldIdDosage] = useState(null);
  const [oldIdTypeIndividu, setOldIdTypeIndividu] = useState(null);

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

        if (presetMed) {
          setIdMedicament(presetMed);
          const presc = await getPrescriptions(presetMed, token);
          setPrescriptions(presc || []);
          if (presetDosage && presetType) {
            const match = (presc || []).find(
              (p) =>
                p.id_dosage === parseInt(presetDosage, 10) &&
                p.id_type_individu === parseInt(presetType, 10),
            );
            if (match) {
              setPrescKey(`${match.id_dosage}-${match.id_type_individu}`);
              setIdDosage(String(match.id_dosage));
              setIdTypeIndividu(String(match.id_type_individu));
              setPosologie(match.posologie || "");
              setOldIdDosage(match.id_dosage);
              setOldIdTypeIndividu(match.id_type_individu);
            }
          }
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Erreur lors du chargement des donnees.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token, presetMed, presetDosage, presetType]);

  const handleMedicamentChange = async (e) => {
    const id = e.target.value;
    setIdMedicament(id);
    setPrescriptions([]);
    setPrescKey("");
    setIdDosage("");
    setIdTypeIndividu("");
    setPosologie("");
    setOldIdDosage(null);
    setOldIdTypeIndividu(null);
    setSuccess("");
    setError("");
    if (!id) return;
    try {
      const data = await getPrescriptions(id, token);
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Erreur chargement prescriptions:", err);
      setError("Erreur lors du chargement des prescriptions.");
    }
  };

  const handlePrescChange = (e) => {
    const key = e.target.value;
    setPrescKey(key);
    if (!key) {
      setIdDosage("");
      setIdTypeIndividu("");
      setPosologie("");
      setOldIdDosage(null);
      setOldIdTypeIndividu(null);
      return;
    }
    const [idDos, idType] = key.split("-").map((n) => parseInt(n, 10));
    const presc = prescriptions.find(
      (p) => p.id_dosage === idDos && p.id_type_individu === idType,
    );
    if (presc) {
      setIdDosage(String(presc.id_dosage));
      setIdTypeIndividu(String(presc.id_type_individu));
      setPosologie(presc.posologie || "");
      setOldIdDosage(presc.id_dosage);
      setOldIdTypeIndividu(presc.id_type_individu);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await updatePrescription(
        {
          old_id_medicament: parseInt(idMedicament, 10),
          old_id_dosage: oldIdDosage,
          old_id_type_individu: oldIdTypeIndividu,
          id_medicament: parseInt(idMedicament, 10),
          id_dosage: parseInt(idDosage, 10),
          id_type_individu: parseInt(idTypeIndividu, 10),
          posologie: posologie || null,
        },
        token,
      );
      setSuccess("Prescription modifiee.");
      const data = await getPrescriptions(idMedicament, token);
      setPrescriptions(data || []);
      setPrescKey("");
      setIdDosage("");
      setIdTypeIndividu("");
      setPosologie("");
      setOldIdDosage(null);
      setOldIdTypeIndividu(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification.");
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
        <h2>Modifier une prescription</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form className="prescriptions-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicament</label>
          <select value={idMedicament} onChange={handleMedicamentChange} required>
            <option value="">-- Choisir un medicament --</option>
            {medicaments.map((m) => (
              <option key={m.id_medicament} value={m.id_medicament}>
                {m.nom_commercial}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Prescription</label>
          <select
            value={prescKey}
            onChange={handlePrescChange}
            required
            disabled={!idMedicament || prescriptions.length === 0}
          >
            <option value="">
              {!idMedicament
                ? "-- Choisir un medicament d'abord --"
                : prescriptions.length === 0
                  ? "-- Aucune prescription --"
                  : "-- Choisir une prescription --"}
            </option>
            {prescriptions.map((p) => (
              <option
                key={`${p.id_dosage}-${p.id_type_individu}`}
                value={`${p.id_dosage}-${p.id_type_individu}`}
              >
                {p.lib_type_individu} — {p.qte_dosage} {p.unite_dosage}
              </option>
            ))}
          </select>
        </div>

        {prescKey && (
          <>
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
                {submitting ? "Enregistrement..." : "Modifier"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default PrescriptionModify;
