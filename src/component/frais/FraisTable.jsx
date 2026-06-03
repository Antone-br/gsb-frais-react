import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FraisTable() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const response = await axios.get(
          `${API_URL}frais/liste/${user.id_visiteur}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setFraisList(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des frais:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFrais();
  }, [user.id_visiteur, token]);

  const filteredFrais = fraisList
    .filter((frais) => !filterNonNull || frais.montantvalide !== null)
    .filter(
      (frais) =>
        (frais.anneemois && frais.anneemois.includes(searchTerm)) ||
        (frais.id_visiteur && frais.id_visiteur.toString().includes(searchTerm)) ||
        (frais.montantvalide !== null && frais.montantvalide.toString().includes(searchTerm)),
    )
    .filter(
      (frais) =>
        minMontant === "" ||
        (frais.montantvalide !== null && frais.montantvalide >= parseFloat(minMontant)),
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce frais ?")) return;
    try {
      await axios.delete(`${API_URL}frais/suppr`, {
        data: { id_frais: id },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFraisList((prev) => prev.filter((frais) => frais.id_frais !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) return <div className="text-center p-4"><strong>Chargement des frais...</strong></div>;

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="mb-3">Liste des Frais</h4>
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par année-mois, ID visiteur ou montant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              min="0"
              className="form-control"
              value={minMontant}
              placeholder="Montant minimum validé"
              onChange={(e) => setMinMontant(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="filterNonNull"
                checked={filterNonNull}
                onChange={(e) => setFilterNonNull(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="filterNonNull">
                Uniquement validés
              </label>
            </div>
          </div>
        </div>
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>ID État</th>
              <th>Année-Mois</th>
              <th>ID Visiteur</th>
              <th>Nb justificatifs</th>
              <th>Date modification</th>
              <th>Montant validé</th>
              <th>Modifier</th>
              <th>Supprimer</th>
            </tr>
          </thead>
          <tbody>
            {filteredFrais.map((frais) => (
              <tr key={frais.id_frais}>
                <td>{frais.id_frais}</td>
                <td>{frais.id_etat}</td>
                <td>{frais.anneemois}</td>
                <td>{frais.id_visiteur}</td>
                <td>{frais.nbjustificatifs}</td>
                <td>{frais.datemodification}</td>
                <td>{frais.montantvalide !== null ? frais.montantvalide : "—"}</td>
                <td>
                  <button
                    onClick={() => navigate(`/frais/modifier/${frais.id_frais}`)}
                    className="btn btn-warning btn-sm"
                  >
                    Modifier
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(frais.id_frais)}
                    className="btn btn-danger btn-sm"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FraisTable;
