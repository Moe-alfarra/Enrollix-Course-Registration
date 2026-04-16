import api from "../api/axios";

export const createUser = async (payload) => {
  const response = await api.post("/admin/users", payload);
  return response.data;
};

export const createCourse = async (payload) => {
  const response = await api.post("/admin/courses", payload);
  return response.data;
};

export const getAdminCourses = async () => {
  const response = await api.get("/admin/courses");
  return response.data;
};

export const getAdminDeletedCourses = async () => {
  const response = await api.get("/admin/courses/deleted");
  return response.data;
};

export const restoreCourse = async (courseId) => {
  const response = await api.patch(`/admin/courses/${courseId}/restore`);
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get("/admin/profile");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const softDeleteCourse = async (courseId) => {
  const response = await api.delete(`/admin/courses/${courseId}/soft-delete`);
  return response.data;
};

export const hardDeleteCourse = async (courseId) => {
  const response = await api.delete(`/admin/courses/${courseId}/hard-delete`);
  return response.data;
};
