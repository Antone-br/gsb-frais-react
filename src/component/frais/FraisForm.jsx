import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, getCurrentUser } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext";

const FraisForm = ({ frais = null }) => {
  const [idFrais, setIdFrais] = useState(null);
  const [anneeMois, setAnneeMois] = useState("");
  const [nbJustificatifs, setNbJustificatifs] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (frais) {
      setIdFrais(frais.id_frais);
      setAnneeMois(frais.anneemois || "");
      setNbJustificatifs(String(frais.nbjustificatifs ?? ""));
      setMontant(String(frais.montantvalide ?? ""));
    }
  }, [frais]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!token) throw new Error("Token manquant");
      const fraisData = {
        anneemois: anneeMois,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
      };
      let url = `${API_URL}frais/ajout`;
      if (frais) {
        fraisData.id_frais = idFrais;
        fraisData.montantvalide = parseFloat(montant);
        url = `${API_URL}frais/modif`;
      } else {
        fraisData.id_visiteur = getCurrentUser().id_visiteur;
      }
      await axios.post(url, fraisData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
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
          <h4 className="mb-3">{frais ? "Modifier un frais" : "Ajouter un frais"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Année/Mois</label>
              <input
                type="text"
                className="form-control"
                value={anneeMois}
                onChange={(e) => setAnneeMois(e.target.value)}
                placeholder="202512"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nb justificatifs</label>
              <input
                type="number"
                className="form-control"
                value={nbJustificatifs}
                onChange={(e) => setNbJustificatifs(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Montant</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="10.15"
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {frais ? "Modifier" : loading ? "Enregistrement..." : "Ajouter"}
              </button>
              {frais && (
                <Link className="btn btn-outline-secondary" to={`/frais/${idFrais}/hors-forfait`}>
                  Gérer frais hors forfait
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FraisForm;
