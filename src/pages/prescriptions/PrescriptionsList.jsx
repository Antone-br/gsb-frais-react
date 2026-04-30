import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAllPrescriptions,
  deletePrescription,
} from "../../services/prescriptionService";
import PrescriptionTable from "../../component/prescriptions/PrescriptionTable";
import "../../styles/Prescriptions.css";

function PrescriptionsList() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllPrescriptions(token);
        setPrescriptions(data || []);
      } catch (err) {
        console.error("Erreur chargement prescriptions:", err);
        setError("Erreur lors du chargement des prescriptions.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const handleEdit = (p) => {
    navigate(
      `/prescriptions/modifier?medicament=${p.id_medicament}&dosage=${p.id_dosage}&type=${p.id_type_individu}`,
    );
  };

  const handleDelete = async (p) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    try {
      await deletePrescription(
        {
          id_medicament: p.id_medicament,
          id_dosage: p.id_dosage,
          id_type_individu: p.id_type_individu,
        },
        token,
      );
      setPrescriptions((prev) =>
        prev.filter(
          (x) =>
            !(
              x.id_medicament === p.id_medicament &&
              x.id_dosage === p.id_dosage &&
              x.id_type_individu === p.id_type_individu
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
        <h2>Toutes les prescriptions</h2>
        <button className="back-button" onClick={() => navigate("/medicaments")}>
          Retour
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {prescriptions.length > 0 && (
        <p className="results-count">
          {prescriptions.length} prescription{prescriptions.length > 1 ? "s" : ""}
        </p>
      )}

      <PrescriptionTable
        prescriptions={prescriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showMedicament
      />
    </div>
  );
}

export default PrescriptionsList;
