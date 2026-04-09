import { ArrowRight } from "lucide-react";

export default function ClassHomeCard({ subject, navigate, index = 0 }) {
  const hue = index % 3;
  const accentClass =
    hue === 0
      ? "from-cyan-100 to-blue-100"
      : hue === 1
        ? "from-emerald-100 to-teal-100"
        : "from-amber-100 to-orange-100";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className={`h-2 w-full bg-gradient-to-r ${accentClass}`} />

      <div className="p-2">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 text-center">
            {subject?.class_name}
          </h3>
        
        </div>

        <p className="mb-4 truncate text-xs text-slate-500">ID: {subject?._id}</p>

        <div>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700"
            onClick={() => navigate(`/${subject._id}`, { state: subject?._id })}
          >
            Open Subjects
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
