import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getMedicament,
  getPrescriptions,
  deletePrescription,
} from "../services/prescriptionService";
import PrescriptionTable from "../component/PrescriptionTable";
import "../styles/Prescriptions.css";

function PrescriptionDetail() {
  const { idMedicament } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [medicament, setMedicament] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [med, presc] = await Promise.all([
          getMedicament(idMedicament, token),
          getPrescriptions(idMedicament, token),
        ]);
        setMedicament(med);
        setPrescriptions(presc || []);
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Erreur lors du chargement des donnees.");
      } finally {
        setLoading(false);
      }
    };
    if (token && idMedicament) fetchAll();
  }, [token, idMedicament]);

  const handleEdit = () => {
    navigate("/prescriptions/modifier");
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

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Prescriptions : {medicament?.nom_commercial || `Medicament #${idMedicament}`}</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <Link
        to={`/prescriptions/ajouter?medicament=${idMedicament}`}
        className="detail-link"
      >
        + Ajouter une prescription
      </Link>

      <PrescriptionTable
        prescriptions={prescriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default PrescriptionDetail;
