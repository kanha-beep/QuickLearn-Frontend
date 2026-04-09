import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL,
  withCredentials: true,
})
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

export const apiRoutes = {
  chapterTests: (subjectId, chapterId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests`,
  chapterGenerateTest: (subjectId, chapterId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/generate`,
  chapterTestById: (subjectId, chapterId, testId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/${testId}`,
  chapterTestSubmissions: (subjectId, chapterId, candidateName = "") =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/submissions${candidateName ? `?candidateName=${encodeURIComponent(candidateName)}` : ""}`,
  chapterTestSubmissionById: (subjectId, chapterId, submissionId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/submissions/${submissionId}`,
  chapterTestSubmit: (subjectId, chapterId, testId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/${testId}/submissions`,
  chapterHighlights: (subjectId, chapterId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/tests/highlights`,
  userChapterTestsDashboard: () => "/api/me/chapter-tests",
  chapterTest: (subjectId, chapterId, mode = "") =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/test${mode ? `?mode=${mode}` : ""}`,
  submitChapterTest: (subjectId, chapterId) =>
    `/api/subjects/${subjectId}/chapters/${chapterId}/test/submit`,
}
