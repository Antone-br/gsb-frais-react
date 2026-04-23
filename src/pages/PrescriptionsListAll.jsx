import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllPrescriptions,
  deletePrescription,
} from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function PrescriptionsListAll() {
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

      {prescriptions.length === 0 ? (
        <p className="no-data-message">Aucune prescription.</p>
      ) : (
        <>
          <p className="results-count">
            {prescriptions.length} prescription{prescriptions.length > 1 ? "s" : ""}
          </p>
          <table className="prescriptions-table">
            <thead>
              <tr>
                <th>Medicament</th>
                <th>Type individu</th>
                <th>Dosage</th>
                <th>Posologie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={`${p.id_medicament}-${p.id_dosage}-${p.id_type_individu}`}>
                  <td>{p.nom_commercial}</td>
                  <td>{p.lib_type_individu}</td>
                  <td>{p.qte_dosage} {p.unite_dosage}</td>
                  <td>{p.posologie || "—"}</td>
                  <td>
                    <button
                      className="icon-button icon-edit"
                      onClick={() => handleEdit(p)}
                      title="Modifier"
                      aria-label="Modifier"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      className="icon-button icon-delete"
                      onClick={() => handleDelete(p)}
                      title="Supprimer"
                      aria-label="Supprimer"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default PrescriptionsListAll;
