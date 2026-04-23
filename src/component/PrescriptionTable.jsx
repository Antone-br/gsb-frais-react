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
              <button
                className="icon-button icon-edit"
                onClick={() => onEdit(presc)}
                title="Modifier"
                aria-label="Modifier"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
              <button
                className="icon-button icon-delete"
                onClick={() => onDelete(presc)}
                title="Supprimer"
                aria-label="Supprimer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PrescriptionTable;
