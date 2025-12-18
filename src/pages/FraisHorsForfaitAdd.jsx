import { useAuth } from "../context/AuthContext";
import FraisHorsForfaitForm from "../component/FraisHorsForfaitForm";

function FraisHorsForfaitAdd() {
  const { user } = useAuth();

  return (
    <div>
      <FraisHorsForfaitForm />
    </div>
  );
}

export default FraisHorsForfaitAdd;
