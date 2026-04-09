import { useEffect, useState } from "react";
import { api, apiRoutes } from "../../api.js";
import ClassHomeCard from "../Pages/ClassHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

function formatDateTime(value) {
  if (!value) return "Recently";
  return new Date(value).toLocaleString();
}

function formatScore(submission) {
  const score = submission?.score ?? 0;
  const total = submission?.test?.totalMarks ?? 0;
  return `${score}/${total}`;
}

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboard, setDashboard] = useState({
    createdTests: [],
    submissions: [],
  });
  const [dashboardError, setDashboardError] = useState("");
  const roles = localStorage.getItem("roles");
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = roles === "admin";

  useEffect(() => {
    const getAllClasses = async () => {
      const res = await api.get("/api/class");
      setClasses(res?.data?.getAllClasses || []);
      setLoading(false);
    };
    getAllClasses();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;

    const loadDashboard = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError("");
        const res = await api.get(apiRoutes.userChapterTestsDashboard());
        setDashboard({
          createdTests: res?.data?.createdTests || [],
          submissions: res?.data?.submissions || [],
        });
      } catch (error) {
        setDashboardError(error?.response?.data?.message || error.message || "Unable to load your test dashboard");
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, [isLoggedIn, isAdmin]);

  if (loading) return <Loading loading={loading} />;

  const normalizedQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const filteredClasses = classes.filter((cl) => {
    const className = (cl?.class_name ?? "").toString().toLowerCase();
    const classOrder = (cl?.order ?? "").toString().toLowerCase();
    const classId = (cl?._id ?? "").toString().toLowerCase();
    return (
      className.includes(normalizedQuery) ||
      classOrder.includes(normalizedQuery) ||
      classId.includes(normalizedQuery)
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4">
      <MainPageHeading />

      {!isAdmin && isLoggedIn && (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                My Test Dashboard
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Saved tests and recent attempts
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Every generated test is stored in the database and grouped by class, subject, and chapter.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">Created Tests</h3>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {dashboard.createdTests.length}
                </span>
              </div>
              {dashboardLoading && <p className="mt-3 text-sm text-slate-500">Loading your saved tests...</p>}
              {dashboardError && <p className="mt-3 text-sm text-red-600">{dashboardError}</p>}
              {!dashboardLoading && !dashboardError && dashboard.createdTests.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">
                  No tests created yet. Generate a chapter test and it will appear here.
                </p>
              )}
              <div className="mt-3 space-y-3">
                {dashboard.createdTests.slice(0, 6).map((test) => (
                  <button
                    key={test._id}
                    type="button"
                    onClick={() =>
                      navigate(`/${test.classRoom?._id}/subjects/${test.subject?._id}/chapters/${test.chapter?._id}/test`, {
                        state: {
                          chapterName: test.chapter?.chapter_name,
                        },
                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-cyan-300 hover:bg-cyan-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{test.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {test.classRoom?.class_name || "Class"} / {test.subject?.subject_name || "Subject"} / {test.chapter?.chapter_name || "Chapter"}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {test.totalQuestions} Q
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(test.createdAt)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">Recent Attempts</h3>
                <span className="rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                  {dashboard.submissions.length}
                </span>
              </div>
              {!dashboardLoading && !dashboardError && dashboard.submissions.length === 0 && (
                <p className="mt-3 text-sm text-slate-500">
                  Your submitted test history will show up here.
                </p>
              )}
              <div className="mt-3 space-y-3">
                {dashboard.submissions.slice(0, 6).map((submission) => (
                  <div
                    key={submission._id}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {submission.test?.title || "Saved Attempt"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {submission.classRoom?.class_name || "Class"} / {submission.subject?.subject_name || "Subject"} / {submission.chapter?.chapter_name || "Chapter"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {formatScore(submission)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(submission.submittedAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          {filteredClasses.length} class{filteredClasses.length !== 1 ? "es" : ""}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredClasses.map((cl, index) => (
          <div key={cl._id} className="min-w-0">
            <ClassHomeCard subject={cl} navigate={navigate} index={index} />
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-800">No class found</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try another keyword or create a new class.
          </p>
        </div>
      )}
    </div>
  );
}
