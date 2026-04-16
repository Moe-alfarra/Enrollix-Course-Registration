import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerStudent = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};