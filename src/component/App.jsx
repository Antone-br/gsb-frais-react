import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar.jsx";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute.jsx";
import Prescriptions from "../pages/Prescriptions.jsx";
import PrescriptionDetail from "../pages/PrescriptionDetail.jsx";
import PrescriptionCreate from "../pages/PrescriptionCreate.jsx";
import PrescriptionDelete from "../pages/PrescriptionDelete.jsx";
import PrescriptionModify from "../pages/PrescriptionModify.jsx";
import PrescriptionStats from "../pages/PrescriptionStats.jsx";
import PrescriptionsListAll from "../pages/PrescriptionsListAll.jsx";


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
                <Prescriptions />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/ajouter"
            element={
              <PrivateRoute>
                <PrescriptionCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/modifier"
            element={
              <PrivateRoute>
                <PrescriptionModify />
              </PrivateRoute>
            }
          />
          <Route
            path="/prescriptions/supprimer"
            element={
              <PrivateRoute>
                <PrescriptionDelete />
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
                <PrescriptionsListAll />
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

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
