export const AddSection = async (e, sections, api, subjectId, chapterId, setSections, navigate,classId) => {
    e.preventDefault();
    console.log("sections ready: ", sections);
    try {
        const res = await api.post(
            `/subjects/${subjectId}/chapters/${chapterId}/sections/add-section`,
            sections
        );
        console.log("response after adding sections: ", res);
        setSections({ sectionName: "", sectionContent: "" });
        return navigate(`/${classId}/subjects/${subjectId}/chapters`);
    } catch (e) {
        console.error("Error adding section: ", e?.response?.data?.msg);
    }
};