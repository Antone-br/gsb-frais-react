import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FraisForm from "../component/FraisForm";
import { getAuthToken } from "../services/authService";
import { API_URL } from "../services/authService.js";

function FraisEdit() {
  const { id } = useParams();
  const [frais, setFrais] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const token = getAuthToken();

        if (!token) {
          throw new Error("Token non trouvé");
        }

        const response = await axios.get(`${API_URL}frais/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Frais récupéré:", response.data);
        setFrais(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du frais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrais();
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!frais) {
    return <div>Frais non trouvé</div>;
  }

  return <FraisForm frais={frais} />;
}

export default FraisEdit;
