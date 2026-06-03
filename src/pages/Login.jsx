import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(login, password);
      if (data) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Identifiant ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <h4 className="mb-4 text-center">Authentification</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Login</label>
              <input
                type="text"
                className="form-control"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                name="login"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                name="password"
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
