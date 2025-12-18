// src/pages/FraisHorsForfaitEdit.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FraisHorsForfaitForm from "../component/FraisHorsForfaitForm";
import { getAuthToken, API_URL } from "../services/authService";

function FraisHorsForfaitEdit() {
  const { idHF } = useParams(); 
  const [fraisHF, setFraisHF] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFraisHF = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token non trouvé");
        }

        const response = await axios.get(`${API_URL}fraisHF/${idHF}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFraisHF(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du frais HF :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFraisHF();
  }, [idHF]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!fraisHF) {
    return <div>Frais hors forfait non trouvé</div>;
  }

  return <FraisHorsForfaitForm fraisHF={fraisHF} />;
}

export default FraisHorsForfaitEdit;
