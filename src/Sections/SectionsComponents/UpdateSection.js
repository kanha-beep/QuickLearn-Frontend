export const UpdateSection = async (e, api, subjectId, chapterId, sectionId, sectionData, navigate, classId, order) => {
    e.preventDefault();
    try {
        const res = await api.patch(
            `/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}/edit`,
            {
                sectionName: sectionData.sectionName,
                sectionContent: sectionData.sectionContent,
                order
            }
        );
        console.log("Section updated successfully: ", res?.data);
        navigate(`/${classId}/subjects/${subjectId}/chapters`);
    } catch (err) {
        console.error("Error updating section: ", err?.response?.data);
    }
};