import "../styles/Prescriptions.css";

function PrescriptionTable({ prescriptions, onEdit, onDelete }) {
  if (prescriptions.length === 0) {
    return <p className="no-data-message">Aucune prescription pour ce medicament.</p>;
  }

  return (
    <table className="prescriptions-table">
      <thead>
        <tr>
          <th>Type individu</th>
          <th>Dosage</th>
          <th>Posologie</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions.map((presc) => (
          <tr key={`${presc.id_dosage}-${presc.id_type_individu}`}>
            <td>{presc.lib_type_individu}</td>
            <td>{presc.qte_dosage} {presc.unite_dosage}</td>
            <td>{presc.posologie || "—"}</td>
            <td>
              <button className="edit-button" onClick={() => onEdit(presc)}>
                Modifier
              </button>
              <button className="delete-button" onClick={() => onDelete(presc)}>
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PrescriptionTable;
