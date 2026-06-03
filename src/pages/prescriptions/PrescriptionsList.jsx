import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllPrescriptions, deletePrescription } from "../../services/prescriptionService";
import PrescriptionTable from "../../component/prescriptions/PrescriptionTable";

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
        setError("Erreur lors du chargement des prescriptions.");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const handleEdit = (p) => {
    navigate(`/prescriptions/modifier?medicament=${p.id_medicament}&dosage=${p.id_dosage}&type=${p.id_type_individu}`);
  };

  const handleDelete = async (p) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    try {
      await deletePrescription({ id_medicament: p.id_medicament, id_dosage: p.id_dosage, id_type_individu: p.id_type_individu }, token);
      setPrescriptions((prev) => prev.filter((x) => !(x.id_medicament === p.id_medicament && x.id_dosage === p.id_dosage && x.id_type_individu === p.id_type_individu)));
      setSuccess("Prescription supprimée.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Toutes les prescriptions</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/medicaments")}>Retour</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {prescriptions.length > 0 && (
        <p className="text-muted">{prescriptions.length} prescription{prescriptions.length > 1 ? "s" : ""}</p>
      )}

      <div className="card">
        <div className="card-body p-0">
          <PrescriptionTable prescriptions={prescriptions} onEdit={handleEdit} onDelete={handleDelete} showMedicament />
        </div>
      </div>
    </div>
  );
}

export default PrescriptionsList;
