import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { useNavigate, useParams } from "react-router-dom";
import { OpenChapterButton } from "../Pages/OpenChapterButton.jsx";
import SubjectHomeCard from "../Subjects/SubjectHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";
import { GetAllSubjects } from "../Subjects/SubjectsComponents/GetAllSubjects.js";
export default function SingleClassPage() {
  const [searchSubject, setSearchSubject] = useState("");
  const { classId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  // const [classes, setClasses] = useState([]);
  useEffect(() => {
    const getAllSubjects = async () => {
      GetAllSubjects(api, setSubjects, setLoading, classId);
    };
    getAllSubjects();
  }, []);
  // console.log("subjects: ", subjects);
  console.log("got classId from params of /classId: ", classId);
  if (loading) return <Loading loading={loading} />;
  // console.log("searched subject: ", searchSubject);
  const filterSubjects = subjects.filter((s) => {
    try {
      return new RegExp(searchSubject, "i").test(s?.subject_name);
    } catch {
      return true;
    }
  });
  console.log("filtered subjects: ", filterSubjects);
  return (
    <div className="mx-auto px-4">
      <MainPageHeading />
      <div className="row">
        <div className="col-2">
          <input
            className="form-control"
            placeholder="Enter Subject Name"
            onChange={(e) => setSearchSubject(e.target.value)}
          />
        </div>
        <div className="col-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => navigate(`/${classId}/add-subject`)}
          >
            Add Subject
          </button>
        </div>
      </div>

      <div className="row">
        {filterSubjects.map((subject) => (
          <div key={subject?._id} className="col-3">
            <SubjectHomeCard
              subject={subject}
              navigate={navigate}
              classId={classId}
            />
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")} className="btn btn-secondary">
        Go back to Classes
      </button>
    </div>
  );
}
