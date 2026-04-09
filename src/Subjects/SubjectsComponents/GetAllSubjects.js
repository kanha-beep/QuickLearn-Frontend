import { apiRoutes } from "../../../api.js";

export const GetAllSubjects = async (api, setSubjects, setLoading, classId) => {
  try {
    const res = await api.get(apiRoutes.subjects, { params: { classId } });
    setSubjects(res?.data?.subjects || []);
  } catch (err) {
    console.error("Failed to fetch subjects:", err?.response?.data?.msg);
    setSubjects([]);
  } finally {
    setLoading(false);
  }
};
