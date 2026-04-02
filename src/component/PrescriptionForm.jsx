import { useState, useEffect } from "react";
import "../styles/Prescriptions.css";

function PrescriptionForm({ dosages, typesIndividu, editData, onSubmit, onCancel }) {
  const [idDosage, setIdDosage] = useState("");
  const [idTypeIndividu, setIdTypeIndividu] = useState("");
  const [posologie, setPosologie] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setIdDosage(String(editData.id_dosage));
      setIdTypeIndividu(String(editData.id_type_individu));
      setPosologie(editData.posologie || "");
    } else {
      setIdDosage("");
      setIdTypeIndividu("");
      setPosologie("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({
      id_dosage: parseInt(idDosage, 10),
      id_type_individu: parseInt(idTypeIndividu, 10),
      posologie: posologie || null,
    });
    setLoading(false);
  };

  return (
    <div className="prescriptions-form">
      <h3>{editData ? "Modifier une prescription" : "Ajouter une prescription"}</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Dosage</label>
          <select value={idDosage} onChange={(e) => setIdDosage(e.target.value)} required>
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
          <select value={idTypeIndividu} onChange={(e) => setIdTypeIndividu(e.target.value)} required>
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
          <button type="submit" className="submit-button" disabled={loading}>
            {editData ? "Modifier" : loading ? "Enregistrement..." : "Ajouter"}
          </button>
          {editData && (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PrescriptionForm;
