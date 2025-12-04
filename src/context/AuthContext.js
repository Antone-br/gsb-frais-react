import { createContext, useContext, useEffect, useState } from "react";
import { signIn, logout, getAuthToken, getCurrentUser } from '../services/authService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginUser = async (login, password) => {
    setLoading(true);
    try {
      const data = await signIn(login, password);
      setUser(data.visiteur);
      setToken(data.access_token);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const user = getCurrentUser();
    const token = getAuthToken();
    if (user && token) {
      setUser(user);
      setToken(token);
    }
    setLoading(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

