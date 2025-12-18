import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, getCurrentUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext";
import "../styles/FraisForm.css";
import "../styles/FraisHorsForfait.css";


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
        console.log(url);
      } else {
        fraisData.idvisiteur = getCurrentUser().id_visiteur;
      }

      const response = await axios.post(url, fraisData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'enregistrement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="frais-form-container">
      <form className="frais-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Année/Mois</label>
          <input
            type="text"
            value={anneeMois}
            onChange={(e) => setAnneeMois(e.target.value)}
            placeholder="202512"
          />
        </div>
        <div className="form-group">
          <label>Nb justificatifs</label>
          <input
            type="number"
            value={nbJustificatifs}
            onChange={(e) => setNbJustificatifs(e.target.value)}
            placeholder="1"
          />
        </div>
        <div className="form-group">
          <label>Montant</label>
          <input
            type="number"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            placeholder="10,15"
          />
        </div>

        <Link className="frais-hors-forfait-link" to={`/frais/${idFrais}/hors-forfait`}> Gérer frais hors forfait</Link>

        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          { frais ? "Modifier" : (loading ? "Enregistrement..." : "Ajouter") }
        </button>
      </form>
    </div>
  );
};

export default FraisForm;
