import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function FraisHorsForfaitTable() {
  const [fraisHFList, setFraisHFList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id: idFraisHF } = useParams();

  useEffect(() => {
    const fetchFraisHF = async () => {
      try {
        const response = await axios.get(
          `${API_URL}fraisHF/liste/${idFraisHF}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFraisHFList(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des frais HF:", error);
      } finally {
        setLoading(false);
      }
    };
    if (idFraisHF && token) fetchFraisHF();
  }, [idFraisHF, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce frais hors forfait ?")) return;
    try {
      await axios.delete(`${API_URL}fraisHF/suppr`, {
        data: { id_fraisHF: id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFraisHFList((prev) => prev.filter((f) => f.id_fraishorsforfait !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const total = fraisHFList.reduce((sum, f) => sum + (parseFloat(f.montant_fraishorsforfait) || 0), 0);

  if (loading) return <div className="text-center p-4"><strong>Chargement...</strong></div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">Frais hors forfait</h4>
            <div className="d-flex gap-2">
              <Link className="btn btn-success btn-sm" to={`/frais/${idFraisHF}/hors-forfait/ajouter`}>
                + Ajouter
              </Link>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/frais/modifier/${idFraisHF}`)}>
                Retour
              </button>
            </div>
          </div>
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Libellé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fraisHFList.map((f) => (
                <tr key={f.id_fraishorsforfait}>
                  <td>{f.id_fraishorsforfait}</td>
                  <td>{f.date_fraishorsforfait}</td>
                  <td>{f.montant_fraishorsforfait !== null ? `${parseFloat(f.montant_fraishorsforfait).toFixed(2)} €` : "—"}</td>
                  <td>{f.lib_fraishorsforfait}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/frais/${idFraisHF}/hors-forfait/modifier/${f.id_fraishorsforfait}`)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(f.id_fraishorsforfait)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td colSpan="5"><strong>Total : {total.toFixed(2)} €</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FraisHorsForfaitTable;
