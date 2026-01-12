export const DeleteChapter = async (api, chapterId,classId, subjectId, setChaptersList) => {
    try {
        console.log("dlete started")
        const res = await api.delete(`/subjects/${subjectId}/chapters/${chapterId}/delete`);
        setChaptersList(prevChapters => prevChapters.filter(chapter => chapter._id !== chapterId));
        console.log("Chapter deleted:", res?.data?.msg);
    } catch (error) {
        console.error("Error deleting chapter:", error?.response?.data?.msg);
    }
}