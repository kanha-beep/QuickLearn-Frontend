import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import SubjectHomeCard from "../Subjects/SubjectHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { useSubjects } from "../hooks.js";
import { ArrowLeft } from "lucide-react";

export default function SingleClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const subjects = useSubjects(classId);
  if (loading) return <Loading loading={loading} />;

  const normalizedQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const filterSubjects = subjects.filter((s) =>
    (s?.subject_name ?? "").toLowerCase().includes(normalizedQuery),
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -200 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
    >
      <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-2xl font-extrabold text-slate-600">
              {filterSubjects.length} subject
              {filterSubjects.length !== 1 ? "s" : ""}
            </p>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filterSubjects.map((subject) => (
            <div key={subject?._id} className="min-w-0">
              <SubjectHomeCard
                subject={subject}
                navigate={navigate}
                classId={classId}
              />
            </div>
          ))}
        </div>

        {filterSubjects.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No subject found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different keyword or add a new subject.
            </p>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to Classes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
