export const GetSection = async (api, subjectId, chapterId, sectionId, setSectionData, setOrder) => {
    try {
        const res = await api.get(
            `/api/subjects/${subjectId}/chapters/${chapterId}/sections/${sectionId}`
        );
        console.log("Section data for editing: ", res?.data?.section);
        if (typeof setOrder === "function") {
            setOrder(res?.data?.section?.order ?? "");
        }
        setSectionData({
            sectionName: res?.data?.section?.section_name || "",
            sectionContent: (res?.data?.section?.section_content || [])
                .map((s) => s.trim())
                .join("\n"),
            subsections: (res?.data?.section?.subsections || []).map((subsection) => ({
                subsection_name: subsection?.subsection_name || "",
                subsection_content: (subsection?.subsection_content || [])
                    .map((s) => s.trim())
                    .join("\n"),
                order: subsection?.order ?? "",
            })),
        });
    } catch (err) {
        console.error("Error fetching section data: ", err?.response?.data);
    }
};
