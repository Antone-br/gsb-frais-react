import axios from "axios";
import { API_URL } from "./authService";

export const searchMedicaments = async (nom, idFamille, token) => {
  const params = {};
  if (nom) params.nom_commercial = nom;
  if (idFamille) params.id_famille = idFamille;

  const response = await axios.get(`${API_URL}medicaments/recherche`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMedicament = async (id, token) => {
  const response = await axios.get(`${API_URL}medicaments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllMedicaments = async (token) => {
  const response = await axios.get(`${API_URL}medicaments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFamilles = async (token) => {
  const response = await axios.get(`${API_URL}familles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getDosages = async (token) => {
  const response = await axios.get(`${API_URL}dosages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTypesIndividu = async (token) => {
  const response = await axios.get(`${API_URL}types-individu`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPrescriptions = async (idMedicament, token) => {
  const response = await axios.get(
    `${API_URL}prescriptions/${idMedicament}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const createPrescription = async (data, token) => {
  const response = await axios.post(`${API_URL}prescriptions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePrescription = async (data, token) => {
  const response = await axios.put(`${API_URL}prescriptions`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePrescription = async (data, token) => {
  const response = await axios.delete(`${API_URL}prescriptions`, {
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getTopDosages = async (idMedicament, token) => {
  const response = await axios.get(`${API_URL}prescriptions/stats/top`, {
    params: { id_medicament: idMedicament },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
