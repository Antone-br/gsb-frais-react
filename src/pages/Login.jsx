import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginUser(login, password)) {
      navigate('/dashboard');
    } else {
      alert("Identifiants incorrects");
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
              onChange={e => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-form-label">Password :</label>
            <input
              className="login-form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="login-form-button" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
