import { useSearchParams } from "react-router-dom";
import PrescriptionForm from "../../component/prescriptions/PrescriptionForm";

function PrescriptionAdd() {
  const [searchParams] = useSearchParams();
  const lockedMedicamentId = searchParams.get("medicament") || null;
  return <PrescriptionForm lockedMedicamentId={lockedMedicamentId} />;
}

export default PrescriptionAdd;
