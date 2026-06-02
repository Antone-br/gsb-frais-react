import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar.jsx";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute.jsx";
import FraisHorsForfait from "../pages/frais/FraisHorsForfait.jsx";
import FraisHorsForfaitForm from "../pages/frais/FraisHorsForfaitAdd.jsx";
import FraisHorsForfaitEdit from "../pages/frais/FraisHorsForfaitEdit.jsx";
import MedicamentSearch from "../pages/prescriptions/MedicamentSearch.jsx";
import PrescriptionDetail from "../pages/prescriptions/PrescriptionDetail.jsx";
import PrescriptionAdd from "../pages/prescriptions/PrescriptionAdd.jsx";
import PrescriptionEdit from "../pages/prescriptions/PrescriptionEdit.jsx";
import PrescriptionStats from "../pages/prescriptions/PrescriptionStats.jsx";
import PrescriptionsList from "../pages/prescriptions/PrescriptionsList.jsx";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/medicaments"
            element={
              <PrivateRoute>
                <MedicamentSearch />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/ajouter"
            element={
              <PrivateRoute>
                <PrescriptionAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/modifier"
            element={
              <PrivateRoute>
                <PrescriptionEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/stats"
            element={
              <PrivateRoute>
                <PrescriptionStats />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/toutes"
            element={
              <PrivateRoute>
                <PrescriptionsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/medicament/:idMedicament"
            element={
              <PrivateRoute>
                <PrescriptionDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/frais/:id/hors-forfait"
            element={<FraisHorsForfait />}
          />
          <Route
            path="/frais/:id/hors-forfait/ajouter"
            element={<FraisHorsForfaitForm />}
          />
          <Route
            path="/frais/:id/hors-forfait/modifier/:idHF"
            element={<FraisHorsForfaitEdit />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
