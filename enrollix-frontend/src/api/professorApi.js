import api from "../api/axios";

export const getProfessorProfile = async () => {
  const response = await api.get("/professors/profile");
  return response.data;
};

export const getProfessorCourses = async () => {
  const response = await api.get("/professors/courses");
  return response.data;
};

export const getProfessorOfferings = async () => {
  const response = await api.get("/professors/offerings");
  return response.data;
};

export const createProfessorOffering = async (payload) => {
  const response = await api.post("/professors/offerings", payload);
  return response.data;
};

export const updateProfessorOffering = async (offeringId, payload) => {
  const response = await api.put(`/professors/offerings/${offeringId}`, payload);
  return response.data;
};

export const deleteProfessorOffering = async (offeringId) => {
  const response = await api.delete(`/professors/offerings/${offeringId}`);
  return response.data;
};

export const getOfferingStudents = async (offeringId) => {
  const response = await api.get(`/professors/offerings/${offeringId}/students`);
  return response.data;
};