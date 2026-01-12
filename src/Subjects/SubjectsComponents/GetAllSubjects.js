export const GetAllSubjects = async (api, setSubjects, setLoading, classId) => {
    try {
        // console.log("getting all subject")
        const res = await api.get("/subjects", { params: { classId } });
        // console.log("Get ALL:", res?.data);
        setSubjects(res?.data?.subjects || []);
        // console.log("total subjects:", res?.data?.count);
    } catch (err) {
        console.error("Failed to fetch subjects:", err?.response?.data?.msg);
        setSubjects([]);
    } finally {
        setLoading(false);
    }
};