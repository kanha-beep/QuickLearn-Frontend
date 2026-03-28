import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SubjectHomeCard from "../Subjects/SubjectHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";
import { GetAllSubjects } from "../Subjects/SubjectsComponents/GetAllSubjects.js";

export default function SingleClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const getAllSubjects = async () => {
      GetAllSubjects(api, setSubjects, setLoading, classId);
    };
    getAllSubjects();
  }, [classId]);

  if (loading) return <Loading loading={loading} />;

  const normalizedQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const filteredSubjects = subjects.filter((subject) => {
    const subjectName = (subject?.subject_name ?? "").toString().toLowerCase();
    const order = (subject?.order ?? "").toString().toLowerCase();
    return subjectName.includes(normalizedQuery) || order.includes(normalizedQuery);
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4">
      <MainPageHeading />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">
          {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredSubjects.map((subject) => (
          <div key={subject?._id} className="min-w-0">
            <SubjectHomeCard subject={subject} navigate={navigate} classId={classId} />
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-800">No subject found</h3>
          <p className="mt-1 text-sm text-slate-500">Try another keyword from the navbar search.</p>
        </div>
      )}
    </div>
  );
}
