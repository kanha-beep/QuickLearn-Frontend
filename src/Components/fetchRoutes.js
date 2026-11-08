import { addChapterRoute, addSectionRoute, addSubjectRoute, ChapterRoute, deleteChapterRoute, deleteSectionRoute, editSectionRoute, sectionRoute, singleSectionRoute, subjectRoute, updateSectionRoute } from "../../api"
import { getCachedRequest, invalidateCachedRequests } from "../data/requestCache.js";

export const resGetSubjects = async (classId) => {
    const res = await getCachedRequest(`subjects:${classId}`, () => subjectRoute(classId))
    // console.log("got subjects: ", res?.data?.subjects)
    return res?.data?.subjects;
}
export const resAddSubject = async (classId, subjectName, order) => {
    const res = await addSubjectRoute(classId, subjectName, order)
    invalidateCachedRequests(`subjects:${classId}`)
    console.log("subject added: ", res?.data)
    return res?.data;
}
export const resAddChapter = async (subjectId) => {
    const res = await addChapterRoute(subjectId)
    invalidateCachedRequests(`chapters:${subjectId}`)
    console.log("chapter added: ", res?.data)
    return res?.data;
}
export const resGetChapters = async (subjectId) => {
    const res = await getCachedRequest(`chapters:${subjectId}`, () => ChapterRoute(subjectId));
    console.log("all chapters: ", res?.data)
    return res?.data
}
export const resDeleteChapter = async (subjectId, chapterId) => {
    const res = await deleteChapterRoute(subjectId, chapterId);
    invalidateCachedRequests(`chapters:${subjectId}`)
    invalidateCachedRequests(`sections:${subjectId}:${chapterId}`)
    console.log("chapter deleted: ", res?.data)
    return res?.data;
}
export const resAddSection = async (subjectId, chapterId, sections) => {
    const res = await addSectionRoute(subjectId, chapterId, sections);
    invalidateCachedRequests(`sections:${subjectId}:${chapterId}`)
    console.log("section added: ", res?.data)
    return res?.data;
}
export const resGetSection = async (subjectId, chapterId) => {
    try {
        const res = await getCachedRequest(`sections:${subjectId}:${chapterId}`, () => sectionRoute(subjectId, chapterId));
        console.log("all sections: ", res?.data?.sections)
        return res?.data?.sections
    } catch (e) {
        console.log("error in fetching sections: ", e.message)
    }
}
export const resGetSingleSection = async (subjectId, chapterId, sectionId) => {
    const res = await getCachedRequest(`section:${subjectId}:${chapterId}:${sectionId}`, () => singleSectionRoute(subjectId, chapterId, sectionId));
    console.log("single section: ", res?.data)
    return res?.data;
}
export const resEditSection = async (subjectId, chapterId, sectionId) => {
    const res = await editSectionRoute(subjectId, chapterId, sectionId);
    console.log("section edited: ", res?.data)
    return res?.data;
}
export const resUpdateSection = async (subjectId, chapterId, sectionId, sectionData, order) => {
    const res = await updateSectionRoute(subjectId, chapterId, sectionId, sectionData, order);
    invalidateCachedRequests(`sections:${subjectId}:${chapterId}`)
    invalidateCachedRequests(`section:${subjectId}:${chapterId}:${sectionId}`)
    console.log("section updated: ", res?.data)
    return res?.data;
}
export const resDeleteSection = async (subjectId, chapterId, sectionId) => {
    const res = await deleteSectionRoute(subjectId, chapterId, sectionId);
    invalidateCachedRequests(`sections:${subjectId}:${chapterId}`)
    invalidateCachedRequests(`section:${subjectId}:${chapterId}:${sectionId}`)
    console.log("section deleted: ", res?.data)
    return res?.data;
}
