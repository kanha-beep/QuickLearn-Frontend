import { OpenChapterButton } from "../Pages/OpenChapterButton.jsx";

export default function SubjectHomeCard({ subject, navigate, classId }) {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <span className="w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
          Subject {subject?.order ?? "-"}
        </span>

        <div className="mt-4 flex-1">
          <h2 className="text-lg font-semibold uppercase text-slate-900">
            {subject?.subject_name}
          </h2>
        </div>

        <div className="mt-4">
          <OpenChapterButton navigate={navigate} subject={subject} classId={classId} />
        </div>
      </div>
    </div>
  );
}
