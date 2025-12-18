import { useState, useEffect } from "react";
import "../styles/FraisHorsForfait.css";
import "../styles/FraisTable.css";
import axios from "axios";
import { API_URL } from "../services/authService";
import { useAuth } from "../context/AuthContext";
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFraisHFList(response.data || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des frais HF:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (idFraisHF && token) {
      fetchFraisHF();
    }
  }, [idFraisHF]);

  if (loading) {
    return (
      <div>
        <b>Chargement des frais hors forfait...</b>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce frais hors forfait ?"))
      return;

    try {
      await axios.delete(`${API_URL}fraisHF/suppr`, {
        data: { id_fraisHF: id },
        headers: { Authorization: `Bearer ${token}` },
      });

      setFraisHFList((prev) =>
        prev.filter((fraisHF) => fraisHF.id_fraishorsforfait !== id),
      );
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="frais-hors-forfait-container">
      <h2>Liste des Frais Hors Forfait</h2>

      <table className="frais-hors-forfait-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Libellé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fraisHFList.map((fraisHF) => (
            <tr key={fraisHF.id_fraishorsforfait}>
              <td>{fraisHF.id_fraishorsforfait}</td>
              <td>{fraisHF.date_fraishorsforfait}</td>
              <td>
                {fraisHF.montant_fraishorsforfait !== null
                  ? `${parseFloat(
                      fraisHF.montant_fraishorsforfait,
                    ).toFixed(2)} €`
                  : "—"}
              </td>
              <td>{fraisHF.lib_fraishorsforfait}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(
                      `/frais/${idFraisHF}/hors-forfait/modifier/${fraisHF.id_fraishorsforfait}`,
                    )
                  }
                  className="edit-button"
                >
                  Modifier
                </button>
                <button
                  onClick={() =>
                    handleDelete(fraisHF.id_fraishorsforfait)
                  }
                  className="delete-button"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-row">
        <div colSpan="3">Total 0.00 €</div>
        <div colSpan="2">
          <div className="table-actions">
            <button
              onClick={() =>
                navigate(`/frais/${idFraisHF}/hors-forfait/ajouter`)
              }
              className="add-button"
            >
              Ajouter
            </button>
            <button
              onClick={() => navigate(`/frais/${idFraisHF}`)}
              className="back-button"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FraisHorsForfaitTable;
