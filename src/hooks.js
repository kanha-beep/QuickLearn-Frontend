import { useEffect } from "react";
import { useState } from 'react';
import { resAddChapter, resAddSection, resAddSubject, resDeleteChapter, resDeleteSection, resEditSection, resGetChapters, resGetSection, resGetSingleSection, resGetSubjects, resUpdateSection } from "./Components/fetchRoutes";

export const useSubjects = (classId) => {
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        resGetSubjects(classId).then(setSubjects).catch((e) => console.log("all subjects error: ", e?.response?.data?.msg));
    }, [classId])
    return subjects;
}
export const useAddSubject = () => {
    return (classId, subjectName, order) => {
        return resAddSubject(classId, subjectName, order);
    };
};

export const useChapters = (subjectId) => {
    const [chapters, setChapters] = useState(null)
    useEffect(() => {
        if (!subjectId) return
        resGetChapters(subjectId)
            .then(setChapters)
            .catch(e => console.log(e))
    }, [subjectId])
    return {
        chaptersList: chapters?.chaptersList || [],
        chapterCount: chapters?.chapterCount || 0,
        subjectName: chapters?.subjectName?.subject_name || ""
    }
}
export const useSections = (subjectId, chapterId) => {
    const [sections, setSections] = useState([])
    useEffect(() => {
        if (!subjectId || !chapterId) return;
        resGetSection(subjectId, chapterId).then(setSections)
    }, [subjectId, chapterId])
    console.log("sections in hook: ", sections)
    return sections
}
export const useSingleSection = () => {
    const [section, setSection] = useState(null)
    return (subjectId, chapterId, sectionId) => {
        console.log("inside hook: ", subjectId, chapterId, sectionId)
        resGetSingleSection(subjectId, chapterId, sectionId).then(setSection)
        return section;
    }
}
export const useAddChapter = () => {
    return (subjectId) => resAddChapter(subjectId)
}

export const useDeleteChapter = () => {
    return (subjectId, chapterId) => resDeleteChapter(subjectId, chapterId)
}
export const useAddSection = () => {
    return (subjectId, chapterId, sections) => resAddSection(subjectId, chapterId, sections)
}

export const useEditSection = () => {
    return (subjectId, chapterId, sectionId) => resEditSection(subjectId, chapterId, sectionId)
}
export const useUpdateSection = () => {
    return (subjectId, chapterId, sectionId, sectionData, order) => resUpdateSection(subjectId, chapterId, sectionId, sectionData, order)
}
export const useDeleteSection = () => {
    return (subjectId, chapterId, sectionId) => resDeleteSection(subjectId, chapterId, sectionId)
}