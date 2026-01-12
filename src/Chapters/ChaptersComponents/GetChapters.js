export const GetChapters = async (api,_id, setChapterCount, setChaptersList, setSubjectName) => {
    try {
        console.log("Getting chapters for subjectId:", _id);
        const res = await api.get(`/subjects/${_id}/chapters`);
        console.log("Chapters API response:", res?.data);
        setChapterCount(res?.data?.chaptersCount || 0);
        setSubjectName(res?.data?.subjectName?.subject_name || "");
        setChaptersList(res?.data?.chaptersList || []);
    } catch (error) {
        console.error("Error fetching chapters:", error?.response?.data?.msg);
        setChaptersList([]);
    }
};