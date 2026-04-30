import { useAuth } from "../../context/AuthContext";
import FraisForm from "../../component/frais/FraisForm";

function FraisAdd() {
  const { user } = useAuth();

  return (
    <div>
      <FraisForm />
    </div>
  );
}

export default FraisAdd;
