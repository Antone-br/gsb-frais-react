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

    const load = async () => {
      try {
        const rows = await getPrescriptions(idMedicament, token);
        const match = (rows || []).find(
          (p) => p.id_dosage === idDosage && p.id_type_individu === idType
        );
        setPrescription(match || null);
      } catch {
        setPrescription(null);
      } finally {
        setLoading(false);
      }
    };

    load();

  }, [token, idMedicament, idDosage, idType]);

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;
  if (!prescription) return <div className="container mt-4">Prescription non trouvée</div>;

  return <PrescriptionForm prescription={prescription} />;
}

export default PrescriptionEdit;
