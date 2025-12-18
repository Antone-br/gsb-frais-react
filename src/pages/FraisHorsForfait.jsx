import { useAuth } from "../context/AuthContext";
import FraisHorsForfaitTable from "../component/FraisHorsForfaitTable";

function FraisHorsForfait() {
  const { user } = useAuth();

  return (
    <>
      <h1>Frais hors forfait</h1>

      <FraisHorsForfaitTable />
    </>
  );
}

export default FraisHorsForfait;
