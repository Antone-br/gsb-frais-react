import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar.jsx";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute.jsx";
import FraisForm from "./FraisForm.jsx";
import FraisEdit from "../pages/FraisEdit.jsx";
import FraisHorsForfait from "../pages/FraisHorsForfait.jsx";
import FraisHorsForfaitForm from "../pages/FraisHorsForfaitAdd.jsx";
import FraisHorsForfaitEdit from "../pages/FraisHorsForfaitEdit.jsx";


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
          <Route path="/frais/ajouter" element={<FraisForm />} />
          <Route path="/frais/modifier/:id" element={<FraisEdit />} />

          <Route path="/frais/:id/hors-forfait" element={<FraisHorsForfait />} />
          <Route path="/frais/:id/hors-forfait/ajouter" element={<FraisHorsForfaitForm />} />
          <Route path="/frais/:id/hors-forfait/modifier/:fraisHF" element={<FraisHorsForfaitEdit />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
