import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMedicament,
  getPrescriptions,
  getDosages,
  getTypesIndividu,
  createPrescription,
  updatePrescription,
  deletePrescription,
} from "../services/prescriptionService";
import PrescriptionTable from "../component/PrescriptionTable";
import PrescriptionForm from "../component/PrescriptionForm";
import "../styles/Prescriptions.css";

function PrescriptionDetail() {
  const { idMedicament } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [medicament, setMedicament] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [dosages, setDosages] = useState([]);
  const [typesIndividu, setTypesIndividu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editData, setEditData] = useState(null);

  const fetchAll = async () => {
    try {
      const [med, presc, dos, ti] = await Promise.all([
        getMedicament(idMedicament, token),
        getPrescriptions(idMedicament, token),
        getDosages(token),
        getTypesIndividu(token),
      ]);
      setMedicament(med);
      setPrescriptions(presc || []);
      setDosages(dos || []);
      setTypesIndividu(ti || []);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setError("Erreur lors du chargement des donnees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && idMedicament) fetchAll();
  }, [token, idMedicament]);

  const refreshPrescriptions = async () => {
    const data = await getPrescriptions(idMedicament, token);
    setPrescriptions(data || []);
  };

  const handleEdit = (presc) => {
    setEditData(presc);
    setSuccess("");
    setError("");
  };

  const handleDelete = async (presc) => {
    if (!window.confirm("Etes-vous sur de vouloir supprimer cette prescription ?")) return;

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
          (p) => !(p.id_dosage === presc.id_dosage && p.id_type_individu === presc.id_type_individu),
        ),
      );
      setSuccess("Prescription supprimee.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  const handleFormSubmit = async (formData) => {
    setError("");
    setSuccess("");

    try {
      if (editData) {
        await updatePrescription(
          {
            old_id_medicament: parseInt(idMedicament, 10),
            old_id_dosage: editData.id_dosage,
            old_id_type_individu: editData.id_type_individu,
            id_medicament: parseInt(idMedicament, 10),
            ...formData,
          },
          token,
        );
        setSuccess("Prescription modifiee.");
      } else {
        await createPrescription(
          { id_medicament: parseInt(idMedicament, 10), ...formData },
          token,
        );
        setSuccess("Prescription ajoutee.");
      }
      setEditData(null);
      await refreshPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Prescriptions : {medicament?.nom_commercial || `Medicament #${idMedicament}`}</h2>
        <button className="back-button" onClick={() => navigate("/prescriptions")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <PrescriptionTable
        prescriptions={prescriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <PrescriptionForm
        dosages={dosages}
        typesIndividu={typesIndividu}
        editData={editData}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditData(null)}
      />
    </div>
  );
}

export default PrescriptionDetail;
