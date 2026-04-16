import api from "../api/axios";

export const getStudentCourses = async () => {
  const response = await api.get("/students/courses");
  return response.data;
};

export const getStudentOfferings = async () => {
  const response = await api.get("/students/offerings");
  return response.data;
};

export const enrollInOffering = async (offeringId) => {
  const response = await api.post(`/students/enroll/${offeringId}`);
  return response.data;
};

export const getStudentEnrollments = async () => {
  const response = await api.get("/students/enrollments");
  return response.data;
};

export const dropEnrollment = async (enrollmentId) => {
  const response = await api.patch(`/students/enrollments/${enrollmentId}/drop`);
  return response.data;
};

export const getStudentProfile = async () => {
  const response = await api.get("/students/profile");
  return response.data;
};