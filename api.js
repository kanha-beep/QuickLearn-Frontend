import axios from "axios";
import { clearAuthSession, getStoredToken } from "./src/auth.js";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthSession();
    }

    return Promise.reject(error);
  },
);
//class
//subjects //
export const addSubjectRoute = (classId, subjectName, order) => api.post(`/api/subjects/${classId}/add-subjects`, {
  subjectName, order,
});
export const subjectRoute = (classId) => api.get(`/api/subjects?classId=${classId}`)
//chapters
export const addChapterRoute = (subjectId) => api.post(`/api/subjects/${subjectId}/chapters/add-chapters`)
export const ChapterRoute = (subjectId) => api.get(`/api/subjects/${subjectId}/chapters`)
export const deleteChapterRoute = (subjectId, chapterId) => api.delete(`/api/subjects/${subjectId}/chapters/${chapterId}/delete`)
//sections
export const addSectionRoute = (subjectId, chapterId, sections) => api.post(`/api/subjects/${subjectId}/chapters/${chapterId}/sections/add-section`, sections)
export const sectionRoute = (subjectId, chapterId) => api.get(`/api/subjects/${subjectId}/chapters/${chapterId}/sections`)
export const singleSectionRoute = (subjectId, chapterId, sectionId) => api.get(`/api/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}`)
export const editSectionRoute = (subjectId, chapterId, sectionId) => api.get(`/api/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/edit`)
export const updateSectionRoute = (subjectId, chapterId, sectionId, sectionData, order) => api.patch(`/api/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/edit`, {
  sectionName: sectionData.sectionName,
  sectionContent: sectionData.sectionContent,
  order
});
export const deleteSectionRoute = (subjectId, chapterId, sectionId) => api.delete(`/api/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/delete`)
