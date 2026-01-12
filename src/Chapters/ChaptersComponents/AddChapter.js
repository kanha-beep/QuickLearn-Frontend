export const AddChapter = async (classId, chaptersList, api, subjectId, setChaptersList, setChapterName, navigate, order) => {
    if (chaptersList.length === 0) return alert("Add at least one chapter");
    try {
        const res = await api.post(
            `/subjects/${subjectId}/chapters/add-chapters`,
            {
                chapters: chaptersList,
                classId: classId,
                order: order
            }
        );
        console.log("Response:", res.data);
        setChaptersList([]);
        setChapterName("");
        alert("Chapters added successfully");
        navigate(`/${classId}/subjects/${subjectId}/chapters`);
    } catch (e) {
        console.error("Error:", e?.response?.data?.msg);
        alert("Failed to add chapters");
    }
};