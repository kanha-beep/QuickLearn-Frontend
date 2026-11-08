import { useEffect } from "react";
import { useState } from 'react';
import { resAddChapter, resAddSection, resAddSubject, resDeleteChapter, resDeleteSection, resEditSection, resGetChapters, resGetSection, resGetSingleSection, resGetSubjects, resUpdateSection } from "./Components/fetchRoutes";

export const useSubjects = (classId) => {
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        let isCurrent = true;
        if (!classId) {
            setSubjects([]);
            return () => { isCurrent = false; };
        }

        resGetSubjects(classId)
            .then((data) => {
                if (isCurrent) setSubjects(data || []);
            })
            .catch((e) => {
                if (!isCurrent) return;
                console.log("all subjects error: ", e?.response?.data?.msg || e?.message);
                setSubjects([]);
            });
        return () => { isCurrent = false; };
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
        let isCurrent = true;
        if (!subjectId) {
            setChapters(null);
            return () => { isCurrent = false; };
        }
        resGetChapters(subjectId)
            .then((data) => {
                if (isCurrent) setChapters(data);
            })
            .catch(e => {
                if (!isCurrent) return;
                console.log(e)
                setChapters({ chaptersList: [], chapterCount: 0, subjectName: "" })
            })
        return () => { isCurrent = false; };
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
        let isCurrent = true;
        if (!subjectId || !chapterId) {
            setSections([]);
            return () => { isCurrent = false; };
        }
        setSections([]);
        resGetSection(subjectId, chapterId)
            .then((data) => {
                if (isCurrent) setSections(data || []);
            })
            .catch(() => {
                if (isCurrent) setSections([]);
            })
        return () => { isCurrent = false; };
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
