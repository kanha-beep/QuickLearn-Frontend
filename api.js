import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

export const apiRoutes = {
    authLogin: "/api/auth/login",
    authRegister: "/api/auth/register",
    classes: "/api/class",
    addClass: "/class/add-class",
    subjects: "/subjects",
    addSubject: (classId) => `/subjects/${classId}/add-subjects`,
    subjectChapters: (subjectId) => `/subjects/${subjectId}/chapters`,
    addChapters: (subjectId) => `/subjects/${subjectId}/chapters/add-chapters`,
    editChapter: (subjectId, chapterId) => `/api/subjects/${subjectId}/chapters/${chapterId}/edit`,
    deleteChapter: (subjectId, chapterId) => `/subjects/${subjectId}/chapters/${chapterId}/delete`,
    chapterSections: (subjectId, chapterId) => `/subjects/${subjectId}/chapters/${chapterId}/sections`,
    addSection: (subjectId, chapterId) =>
        `/subjects/${subjectId}/chapters/${chapterId}/sections/add-section`,
    section: (subjectId, chapterId, sectionId) =>
        `/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}`,
    editSection: (subjectId, chapterId, sectionId) =>
        `/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/edit`,
    deleteSection: (subjectId, chapterId, sectionId) =>
        `/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/delete`,
};
