import { apiRoutes } from "../../../api.js";

export const DeleteChapter = async (api, chapterId, classId, subjectId, setChaptersList) => {
  try {
    console.log("dlete started");
    const res = await api.delete(apiRoutes.deleteChapter(subjectId, chapterId));
    setChaptersList((prevChapters) => prevChapters.filter((chapter) => chapter._id !== chapterId));
    console.log("Chapter deleted:", res?.data?.msg);
  } catch (error) {
    console.error("Error deleting chapter:", error?.response?.data?.msg);
  }
};
