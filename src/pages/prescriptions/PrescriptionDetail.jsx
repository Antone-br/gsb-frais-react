import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMedicament, getPrescriptions, deletePrescription } from "../../services/prescriptionService";
import PrescriptionTable from "../../component/prescriptions/PrescriptionTable";

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
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    if (token && idMedicament) fetchAll();
  }, [token, idMedicament]);

  const handleEdit = (presc) => {
    navigate(`/prescriptions/modifier?medicament=${idMedicament}&dosage=${presc.id_dosage}&type=${presc.id_type_individu}`);
  };

  const handleDelete = async (presc) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    try {
      await deletePrescription({ id_medicament: parseInt(idMedicament, 10), id_dosage: presc.id_dosage, id_type_individu: presc.id_type_individu }, token);
      setPrescriptions((prev) => prev.filter((p) => !(p.id_dosage === presc.id_dosage && p.id_type_individu === presc.id_type_individu)));
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
        <h2>Prescriptions : {medicament?.nom_commercial || `Médicament #${idMedicament}`}</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/medicaments")}>Retour</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <Link className="btn btn-success btn-sm" to={`/prescriptions/ajouter?medicament=${idMedicament}`}>
          + Ajouter une prescription
        </Link>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <PrescriptionTable prescriptions={prescriptions} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default PrescriptionDetail;
