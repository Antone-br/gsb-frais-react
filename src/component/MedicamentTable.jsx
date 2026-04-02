import { Link } from "react-router-dom";
import "../styles/Prescriptions.css";

function MedicamentTable({ medicaments }) {
  if (medicaments.length === 0) {
    return <p className="no-data-message">Aucun medicament trouve.</p>;
  }

  return (
    <div>
      {medicaments.length === 150 && (
        <p style={{ color: "#6c757d", fontStyle: "italic" }}>
          Affichage limite a 150 resultats.
        </p>
      )}
      <table className="prescriptions-table">
        <thead>
          <tr>
            <th>Nom commercial</th>
            <th>Famille</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <tr key={med.id_medicament}>
              <td>{med.nom_commercial}</td>
              <td>{med.lib_famille || "—"}</td>
              <td>
                <Link to={`/prescriptions/${med.id_medicament}`} className="detail-link">
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicamentTable;
