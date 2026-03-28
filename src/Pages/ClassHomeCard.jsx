export default function ClassHomeCard({ subject, navigate }) {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Class {subject?.order ?? "-"}
          </span>
        </div>

        <div className="mt-4 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">
            {subject?.class_name}
          </h2>
          <p className="mt-2 text-xs text-slate-500">ID: {subject?._id}</p>
        </div>

        <button
          className="mt-4 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={() => navigate(`/${subject._id}`, { state: subject?._id })}
        >
          Open Subjects
        </button>
      </div>
    </div>
  );
}
