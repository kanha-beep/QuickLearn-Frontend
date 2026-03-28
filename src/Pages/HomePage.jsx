import { useEffect, useState } from "react";
import { api, apiRoutes } from "../../api.js";
import ClassHomeCard from "../Pages/ClassHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const getAllClasses = async () => {
      const res = await api.get(apiRoutes.classes);
      setClasses(res?.data?.getAllClasses || []);
      setLoading(false);
    };
    getAllClasses();
  }, []);

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
