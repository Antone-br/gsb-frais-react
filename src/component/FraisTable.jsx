import { useState, useEffect } from "react";
// import fraisData from "../data/frais.json";
import "../styles/FraisTable.css";
import axios from "axios";
import {API_URL} from "../services/authService"
import { useAuth } from "../context/AuthContext";

function FraisTable() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");

  const { user, token } = useAuth();

  useEffect(() => {
  const fetchFrais = async () => {
    try {
      const response = await axios.get(`${API_URL}frais/liste/${user.id_visiteur}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFraisList(response.data);  
    } catch (error) {
      console.error('Erreur lors de la récupération des frais:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchFrais();
}, [user.id_visiteur, token]);


  const filteredFrais = fraisList
  .filter(frais =>
    (!filterNonNull || frais.montantvalide !== null)
  )
  .filter(frais =>
    (frais.annemois && frais.annemois.includes(searchTerm)) ||
    (frais.id_visiteur && frais.id_visiteur.toString().includes(searchTerm)) ||
    (frais.montantvalide !== null && frais.montantvalide.toString().includes(searchTerm))
  )
  .filter(frais =>
    minMontant === "" ||
    (frais.montantvalide !== null && frais.montantvalide >= parseFloat(minMontant))
  );


  if (loading) return <div><b>Chargement des frais...</b></div>;

  return (
    <div className="frais-table-container">
      <h2>Liste des Frais</h2>
      
      <div className="filter-container">
        <label>
          <input
            type="checkbox"
            checked={filterNonNull}
            onChange={e => setFilterNonNull(e.target.checked)}
          />
          Afficher uniquement les frais validés
        </label>
        <input
          type="number"
          min="0"
          className="montant-filter"
          value={minMontant}
          placeholder="Montant minimum validé"
          onChange={e => setMinMontant(e.target.value)}
        />
      </div>
      {/* Champ de recherche */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par année-mois, ID visiteur ou montant..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="frais-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID État</th>
            <th>Années-Mois</th>
            <th>ID Visiteur</th>
            <th>Nombre de justificatifs</th>
            <th>Date de modification</th>
            <th>Montant validé</th>
          </tr>
        </thead>
        <tbody>
          {filteredFrais.map(element => (
            <tr key={element.id_frais}>
              <td>{element.id_frais}</td>
              <td>{element.id_etat}</td>
              <td>{element.anneemois}</td>
              <td>{element.id_visiteur}</td>
              <td>{element.nbjustificatifs}</td>
              <td>{element.datemodification}</td>
              <td>{element.montantvalide !== null ? element.montantvalide : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraisTable;
