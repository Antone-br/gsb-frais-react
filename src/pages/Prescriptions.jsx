import { useState } from "react";
import { Link } from "react-router-dom";
import MedicamentSearchForm from "../component/MedicamentSearchForm";
import MedicamentTable from "../component/MedicamentTable";
import "../styles/Prescriptions.css";

function Prescriptions() {
  const [medicaments, setMedicaments] = useState(null);

  return (
    <div className="prescriptions-container">
      <div className="prescriptions-header">
        <h2>Recherche de Medicaments</h2>
        <Link to="/prescriptions/stats" className="stats-link">
          Statistiques Dosages
        </Link>
      </div>

      <MedicamentSearchForm onResults={setMedicaments} />

      {medicaments !== null && <MedicamentTable medicaments={medicaments} />}
    </div>
  );
}

export default Prescriptions;
