import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService.js';
import "../styles/FraisForm.css";

const FraisForm = () => {
  const [idFrais, setIdFrais] = useState(null);
  const [anneeMois, setAnneeMois] = useState('');
  const [nbJustificatifs, setNbJustificatifs] = useState('');
  const [montant, setMontant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant');

      const fraisData = {
        anneemois: anneeMois,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
        id_visiteur: getCurrentUser().id_visiteur,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/frais/ajout`,
        fraisData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);

      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'enregistrement"
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
            onChange={e => setAnneeMois(e.target.value)}
            placeholder="Année/Mois"
          />
        </div>
        <div className="form-group">
          <label>Nb justificatifs</label>
          <input
            type="number"
            value={nbJustificatifs}
            onChange={e => setNbJustificatifs(e.target.value)}
            placeholder="Nb justificatifs"
          />
        </div>
        <div className="form-group">
          <label>Montant</label>
          <input
            type="number"
            step="0.01"
            value={montant}
            onChange={e => setMontant(e.target.value)}
            placeholder="Montant"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
};

export default FraisForm;
