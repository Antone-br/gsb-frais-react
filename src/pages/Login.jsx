import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(login, password);
      if (data) {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Échec de la connexion");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Connexion</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-form-label">Login :</label>
            <input
              className="login-form-input"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              name="login"
            />
          </div>
          <div className="login-form-group">
            <label className="login-form-label">Password :</label>
            <input
              className="login-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
            />
          </div>
          <div>
            <button className="login-form-button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
