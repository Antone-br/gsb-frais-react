// src/component/FraisHorsForfaitForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/FraisHorsForfait.css";

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
      date: date,
      libelle: libelle,
      montant: parseFloat(montant),
    };

    let url = `${API_URL}fraisHF/ajout`;

    if (fraisHF) {
      data.id_fraisHF = idFraisHF;
      url = `${API_URL}fraisHF/modif`;
    }

    console.log("URL =", url);
    console.log("DATA envoyée =", data);

    const response = await axios.post(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Réponse API =", response.data);

    navigate(`/frais/${idFrais}/hors-forfait`);
  } catch (err) {
    console.error("Erreur HF :", err);
    setError(
      err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'enregistrement du frais hors forfait",
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="frais-hors-forfait-container">
      <h2>{fraisHF ? "Modifier un frais hors forfait" : "Ajouter un frais hors forfait"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Libellé"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {fraisHF ? "Modifier" : loading ? "Enregistrement..." : "Ajouter"}
        </button>

        <button
          type="button"
          className="return-button"
          onClick={() => navigate(`/frais/${idFrais}/hors-forfait`)}
        >
          Retour
        </button>
      </form>
    </div>
  );
};

export default FraisHorsForfaitForm;
