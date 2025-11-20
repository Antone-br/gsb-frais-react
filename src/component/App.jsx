import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Navbar from "./Navbar.jsx";
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute.jsx';
import FraisForm from "./FraisForm.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>}
          />
          <Route path="/frais" element={<FraisForm />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;
