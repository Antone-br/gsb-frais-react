import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const FraisHorsForfaitForm = ({ fraisHF = null }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id: idFrais } = useParams();

  const [idFraisHF, setIdFraisHF] = useState(null);
  const [date, setDate] = useState("");
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fraisHF) {
      setIdFraisHF(fraisHF.id_fraishorsforfait);
      setDate(fraisHF.date_fraishorsforfait || "");
      setLibelle(fraisHF.lib_fraishorsforfait || "");
      setMontant(String(fraisHF.montant_fraishorsforfait ?? ""));
    }
  }, [fraisHF]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Token manquant");
      const data = {
        id_frais: parseInt(idFrais, 10),
        date,
        libelle,
        montant: parseFloat(montant),
      };
      let url = `${API_URL}fraisHF/ajout`;
      if (fraisHF) {
        data.id_fraisHF = idFraisHF;
        url = `${API_URL}fraisHF/modif`;
      }
      await axios.post(url, data, { headers: { Authorization: `Bearer ${token}` } });
      navigate(`/frais/${idFrais}/hors-forfait`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <div className="card">
        <div className="card-body">
          <h4 className="mb-3">{fraisHF ? "Modifier un frais hors forfait" : "Ajouter un frais hors forfait"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Libellé</label>
              <input
                type="text"
                className="form-control"
                placeholder="Libellé"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Montant</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="Montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {fraisHF ? "Modifier" : loading ? "Enregistrement..." : "Ajouter"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/frais/${idFrais}/hors-forfait`)}>
                Retour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FraisHorsForfaitForm;
