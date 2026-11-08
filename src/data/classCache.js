import { api } from "../../api.js";
import { getCachedRequest } from "./requestCache.js";

let classes;
let pendingClassesRequest;

// One shared request prevents the app warm-up and the home page from fetching
// the same public data twice.
export const getClasses = () => {
  if (classes) return Promise.resolve(classes);

  if (!pendingClassesRequest) {
    pendingClassesRequest = api
      .get("/api/class")
      .then((response) => {
        classes = response?.data?.getAllClasses || [];
        return classes;
      })
      .finally(() => {
        pendingClassesRequest = undefined;
      });
  }

  return pendingClassesRequest;
};

export const prefetchClasses = () => getClasses().catch(() => undefined);

export const invalidateClasses = () => {
  classes = undefined;
  pendingClassesRequest = undefined;
};

export const getSubjectsForClass = async (classId) => {
  if (!classId) return [];
  const response = await getCachedRequest(`subjects:${classId}`, () =>
    api.get(`/api/subjects?classId=${classId}`),
  );
  return response?.data?.subjects || [];
};

export const prefetchSubjects = (classId) =>
  getSubjectsForClass(classId).catch(() => []);

export const prefetchChapters = (subjectId) => {
  if (!subjectId) return Promise.resolve();
  return getCachedRequest(`chapters:${subjectId}`, () =>
    api.get(`/api/subjects/${subjectId}/chapters`),
  ).catch(() => undefined);
};
