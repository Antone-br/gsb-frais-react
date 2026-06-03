function PrescriptionTable({ prescriptions, onEdit, onDelete, showMedicament = false }) {
  if (prescriptions.length === 0) {
    return <p className="text-muted">Aucune prescription.</p>;
  }

  return (
    <table className="table table-bordered table-striped table-hover">
      <thead className="table-light">
        <tr>
          {showMedicament && <th>Médicament</th>}
          <th>Type individu</th>
          <th>Dosage</th>
          <th>Posologie</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prescriptions.map((presc) => (
          <tr key={`${presc.id_medicament}-${presc.id_dosage}-${presc.id_type_individu}`}>
            {showMedicament && <td>{presc.nom_commercial}</td>}
            <td>{presc.lib_type_individu}</td>
            <td>{presc.qte_dosage} {presc.unite_dosage}</td>
            <td>{presc.posologie || "—"}</td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-warning btn-sm" onClick={() => onEdit(presc)}>
                  Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(presc)}>
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PrescriptionTable;
