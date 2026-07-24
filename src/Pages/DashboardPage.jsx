import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api.js";
import { Loading } from "../Components/Loading.jsx";
import {
  Download,
  Flame,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const metricCardClass =
  "rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur";

const downloadReport = async () => {
  const response = await api.get("/api/me/reports/progress.csv", {
    responseType: "blob",
  });

  const blobUrl = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "progress-report.csv";
  link.click();
  URL.revokeObjectURL(blobUrl);
};
function AdminDashboard({ analytics, classes, navigate }) {
  const overview = analytics?.overview || {};
  const chapterPerformance = analytics?.chapterPerformance || [];
  const studentSnapshots = analytics?.studentSnapshots || [];
  const curriculumMap = analytics?.curriculumMap || [];
  const weakChapters = overview.weakChapters || [];

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_#ecfccb,_#ffffff_45%,_#eff6ff)] p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Teacher Analytics
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              Recruiter-ready command center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Monitor weak chapters, class coverage, student momentum, and
              curriculum health from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/add-class")}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Class
            </button>
            <button
              type="button"
              onClick={downloadReport}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className={metricCardClass}>
          <p className="text-sm font-semibold text-slate-600">
            Total Submissions
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.totalSubmissions || 0}
          </p>
        </article>
        <article className={metricCardClass}>
          <p className="text-sm font-semibold text-slate-600">
            Active Students
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.activeStudents || 0}
          </p>
        </article>
        <article className={metricCardClass}>
          <p className="text-sm font-semibold text-slate-600">
            Tracked Chapters
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {chapterPerformance.length}
          </p>
        </article>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Class management</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cl) => (
            <article
              key={cl._id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {cl?.class_name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">ID: {cl?._id}</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => navigate(`/${cl._id}`)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-white"
                >
                  Open Class
                </button>
                <button
                  onClick={() => navigate(`/${cl._id}/add-subject`)}
                  className="rounded-lg border border-blue-200 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-50"
                >
                  Add Subject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Lowest performing chapters
          </h2>
          <div className="mt-4 space-y-3">
            {weakChapters.map((item) => (
              <article
                key={item.chapterId}
                className="rounded-2xl border border-rose-200 bg-rose-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.chapterName}
                    </p>
                    <p className="text-xs text-slate-600">
                      {item.className} • {item.subjectName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-rose-700">
                      {item.accuracy}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.attempts} attempts
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Student momentum</h2>
          <div className="mt-4 space-y-3">
            {studentSnapshots.map((item) => (
              <article
                key={item.userId}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.studentName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last active{" "}
                      {item.lastActiveAt
                        ? new Date(item.lastActiveAt).toLocaleDateString()
                        : "No activity"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">
                      {item.averageAccuracy}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.attempts} attempts
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Curriculum map</h2>
        <p className="mt-1 text-sm text-slate-500">
          Class → subject → chapter → section → test coverage
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {curriculumMap.map((classRoom) => (
            <article
              key={classRoom._id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {classRoom.class_name}
              </h3>
              <div className="mt-3 space-y-3">
                {classRoom.subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <p className="font-semibold text-slate-800">
                      {subject.subject_name}
                    </p>
                    <div className="mt-2 space-y-2">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter._id}
                          className="rounded-xl bg-slate-50 p-3"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {chapter.chapter_name} • {chapter.tests} tests
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {chapter.sections
                              .map((section) => section.section_name)
                              .join(", ") || "No sections yet"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
function StudentDashboard({ dashboard }) {
  const overview = dashboard?.overview || {};
  const mastery = dashboard?.mastery || [];
  const dueReviews = dashboard?.dueReviews || [];
  const studyPlanner = dashboard?.studyPlanner || [];

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(135deg,_#fff7ed,_#ffffff_45%,_#ecfeff)] p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Personal Study Planner
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Turn weak chapters into daily wins
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Your planner is prioritising due reviews, lower-mastery chapters,
              and recent mistakes to keep revision tight and predictable.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadReport}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className={metricCardClass}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <TrendingUp className="h-4 w-4 text-sky-600" />
            Total Attempts
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.totalAttempts || 0}
          </p>
        </article>
        <article className={metricCardClass}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Target className="h-4 w-4 text-emerald-600" />
            Chapters Tracked
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.chaptersTracked || 0}
          </p>
        </article>
        <article className={metricCardClass}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Sparkles className="h-4 w-4 text-amber-600" />
            Due Reviews
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.dueReviews || 0}
          </p>
        </article>
        <article className={metricCardClass}>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Flame className="h-4 w-4 text-rose-600" />
            Streak
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {overview.streak || 0} days
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Mastery by chapter
              </h2>
              <p className="text-sm text-slate-500">
                Spaced repetition priorities and chapter confidence.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {mastery.map((item) => (
              <article
                key={item.chapterId}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.subjectName}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.chapterName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.spacedRepetition} • Next review{" "}
                      {new Date(item.nextReviewAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {item.masteryScore}%
                    </p>
                    <p className="text-xs text-slate-500">
                      Accuracy {item.averageAccuracy}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500"
                    style={{ width: `${Math.min(item.masteryScore, 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Weak sections:{" "}
                  {item.weakSectionNames?.length
                    ? item.weakSectionNames.join(", ")
                    : "No major weak spots detected."}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Due now</h2>
            <div className="mt-3 space-y-3">
              {dueReviews.length ? (
                dueReviews.map((item) => (
                  <div
                    key={item.chapterId}
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-3"
                  >
                    <p className="font-semibold text-slate-900">
                      {item.chapterName}
                    </p>
                    <p className="text-sm text-slate-600">{item.subjectName}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No urgent revision blocks right now.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              7-day AI revision plan
            </h2>
            <div className="mt-3 space-y-3">
              {studyPlanner.map((item) => (
                <article
                  key={`${item.chapterId}-${item.dayOffset}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {item.chapterName}
                  </h3>
                  <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                    {item.goals.map((goal) => (
                      <li key={goal}>{goal}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Quiz prompts: {item.quiz.prompts.join(" ")}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage({ userRoles = "" }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [studentDashboard, setStudentDashboard] = useState(null);
  const [teacherAnalytics, setTeacherAnalytics] = useState(null);
  const isAdmin = userRoles === "admin";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (isAdmin) {
          const [classesRes, analyticsRes] = await Promise.all([
            api.get("/api/class"),
            api.get("/api/me/teacher-analytics"),
          ]);
          setClasses(classesRes?.data?.getAllClasses || []);
          setTeacherAnalytics(analyticsRes?.data || null);
          return;
        }

        const res = await api.get("/api/me/learning-dashboard");
        setStudentDashboard(res?.data || null);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error?.response?.data || error,
        );
        setClasses([]);
        setStudentDashboard(null);
        setTeacherAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAdmin]);

  if (loading) return <Loading loading={loading} />;

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5">
      {isAdmin ? (
        <AdminDashboard
          analytics={teacherAnalytics}
          classes={classes}
          navigate={navigate}
        />
      ) : (
        <StudentDashboard dashboard={studentDashboard} />
      )}
    </div>
  );
}
