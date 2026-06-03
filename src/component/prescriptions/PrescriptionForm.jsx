import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllMedicaments, getDosages, getTypesIndividu, createPrescription, updatePrescription } from "../../services/prescriptionService";
import Select from "./Select";

function PrescriptionForm({ prescription = null, lockedMedicamentId = null }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [refs, setRefs] = useState(null);
  const [form, setForm] = useState({
    id_medicament: prescription?.id_medicament ?? lockedMedicamentId ?? "",
    id_dosage: prescription?.id_dosage ?? "",
    id_type_individu: prescription?.id_type_individu ?? "",
    posologie: prescription?.posologie ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!token) return;
    Promise.all([getAllMedicaments(token), getDosages(token), getTypesIndividu(token)])
      .then(([medicaments, dosages, typesIndividu]) =>
        setRefs({ medicaments: medicaments || [], dosages: dosages || [], typesIndividu: typesIndividu || [] }),
      )
      .catch(() => setError("Erreur lors du chargement des données."));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        id_medicament: parseInt(form.id_medicament, 10),
        id_dosage: parseInt(form.id_dosage, 10),
        id_type_individu: parseInt(form.id_type_individu, 10),
        posologie: form.posologie || null,
      };
      if (prescription) {
        await updatePrescription({ ...payload, old_id_medicament: payload.id_medicament, old_id_dosage: prescription.id_dosage, old_id_type_individu: prescription.id_type_individu }, token);
      } else {
        await createPrescription(payload, token);
      }
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!refs) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{prescription ? "Modifier une prescription" : "Ajouter une prescription"}</h2>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Retour</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <Select
              label="Médicament"
              value={form.id_medicament}
              onChange={(v) => update("id_medicament", v)}
              options={refs.medicaments}
              valueKey="id_medicament"
              getLabel={(m) => m.nom_commercial}
              placeholder="-- Choisir un médicament --"
              disabled={!!prescription || !!lockedMedicamentId}
            />
            <Select
              label="Dosage"
              value={form.id_dosage}
              onChange={(v) => update("id_dosage", v)}
              options={refs.dosages}
              valueKey="id_dosage"
              getLabel={(d) => `${d.qte_dosage} fois par ${d.unite_dosage.toLowerCase()}`}
              placeholder="-- Choisir un dosage --"
            />
            <Select
              label="Type individu"
              value={form.id_type_individu}
              onChange={(v) => update("id_type_individu", v)}
              options={refs.typesIndividu}
              valueKey="id_type_individu"
              getLabel={(ti) => ti.lib_type_individu}
              placeholder="-- Choisir un type --"
            />
            <div className="mb-3">
              <label className="form-label">Posologie</label>
              <input
                type="text"
                className="form-control"
                value={form.posologie}
                onChange={(e) => update("posologie", e.target.value)}
                placeholder="Posologie (comment prendre le médicament, max 100 car.)"
                maxLength={100}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Enregistrement..." : prescription ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionForm;
