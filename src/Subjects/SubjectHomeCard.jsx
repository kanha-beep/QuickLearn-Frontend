import { OpenChapterButton } from "../Pages/OpenChapterButton.jsx";
import { GoToAddChapterButton } from "../Chapters/ChaptersButtons/GoToAddChapterButton.jsx";

export default function SubjectHomeCard({ subject, navigate, classId }) {
  const roles = localStorage.getItem("roles");
  const storedUser = localStorage.getItem("user");
  const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  const isAdmin = roles === "admin" || userRole === "admin";

  return (
    <div className="py-2">
      <article className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="mb-3">
          <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {(subject?.subject_name ?? "").toUpperCase()}
          </h2>
          <p className="mt-1 text-xs text-slate-500">Subject ID: {subject?._id}</p>
        </div>
        <div className="mt-4">
          <OpenChapterButton
            navigate={navigate}
            subject={subject}
            classId={classId}
          />
        </div>
        {isAdmin && (
          <div className="mt-3">
            <GoToAddChapterButton
              navigate={navigate}
              subjectId={subject?._id}
              classId={classId}
              subjectName={subject?.subject_name}
              className="w-full"
            />
          </div>
        )}
      </article>
    </div>
  );
}
