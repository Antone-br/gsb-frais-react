import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { searchMedicaments, getFamilles } from "../services/prescriptionService";
import "../styles/Prescriptions.css";

function MedicamentSearchForm({ onResults }) {
  const { token } = useAuth();
  const [nomCommercial, setNomCommercial] = useState("");
  const [idFamille, setIdFamille] = useState("");
  const [familles, setFamilles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFamilles = async () => {
      try {
        const data = await getFamilles(token);
        setFamilles(data || []);
      } catch (err) {
        console.error("Erreur chargement familles:", err);
      }
    };
    if (token) fetchFamilles();
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await searchMedicaments(nomCommercial, idFamille || null, token);
      onResults(data || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError("Erreur lors de la recherche des medicaments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Nom commercial</label>
          <input
            type="text"
            value={nomCommercial}
            onChange={(e) => setNomCommercial(e.target.value)}
            placeholder="Rechercher un medicament..."
          />
        </div>

        <div className="form-group">
          <label>Famille</label>
          <select value={idFamille} onChange={(e) => setIdFamille(e.target.value)}>
            <option value="">-- Toutes les familles --</option>
            {familles.map((f) => (
              <option key={f.id_famille} value={f.id_famille}>
                {f.lib_famille}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default MedicamentSearchForm;
