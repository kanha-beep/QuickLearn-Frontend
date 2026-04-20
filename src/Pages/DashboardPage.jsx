import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api.js";
import { Loading } from "../Components/Loading.jsx";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const getAllClasses = async () => {
      try {
        const res = await api.get("/api/class");
        setClasses(res?.data?.getAllClasses || []);
      } catch (error) {
        console.error("Failed to load dashboard classes:", error?.response?.data || error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    getAllClasses();
  }, []);

  if (loading) return <Loading loading={loading} />;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredClasses = classes.filter((cl) => {
    const className = (cl?.class_name ?? "").toLowerCase();
    return className.includes(normalizedQuery);
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Admin Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Class Management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add classes and add subjects to any class from this page.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/add-class")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cl) => (
          <article
            key={cl._id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {cl?.class_name}
            </h2>
            <p className="mt-1 text-xs text-slate-500">ID: {cl?._id}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => navigate(`/${cl._id}`)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
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
    </div>
  );
}
