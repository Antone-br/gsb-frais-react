import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPrescriptions } from "../../services/prescriptionService";
import PrescriptionForm from "../../component/prescriptions/PrescriptionForm";

function PrescriptionEdit() {
  const [searchParams] = useSearchParams();
  const idMedicament = searchParams.get("medicament");
  const idDosage = parseInt(searchParams.get("dosage"), 10);
  const idType = parseInt(searchParams.get("type"), 10);

  const { token } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !idMedicament) {
      setLoading(false);
      return;
    }
    getPrescriptions(idMedicament, token)
      .then((rows) => {
        const match = (rows || []).find(
          (p) => p.id_dosage === idDosage && p.id_type_individu === idType,
        );
        setPrescription(match || null);
      })
      .catch((err) => console.error("Erreur chargement prescription:", err))
      .finally(() => setLoading(false));
  }, [token, idMedicament, idDosage, idType]);

  if (loading) {
    return <div className="prescriptions-container"><b>Chargement...</b></div>;
  }

  if (!prescription) {
    return <div className="prescriptions-container">Prescription non trouvée</div>;
  }

  return <PrescriptionForm prescription={prescription} />;
}

export default PrescriptionEdit;
