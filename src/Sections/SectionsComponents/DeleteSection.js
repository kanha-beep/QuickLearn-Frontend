export const DeleteSection = async (api, _id, chapterId, sectionId, setSectionsList) => {
    console.log(
        "Deleting section with ID:",
        sectionId,
        "from chapter ID:",
        chapterId
    );
    if (!_id || !chapterId || !sectionId) {
        console.error("Missing ids for deleting section", { _id, chapterId, sectionId });
        return;
    }
    try {
        await api.delete(
            `/api/subjects/${_id}/chapters/${chapterId}/sections/${sectionId}/delete`
        );
        if (typeof setSectionsList === "function") {
            setSectionsList((prevSections = []) =>
                prevSections.filter((section) => section._id !== sectionId)
            );
        }
    } catch (error) {
        console.error("Error deleting section:", error?.response?.data?.msg);
    }

};
