import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { useNavigate } from "react-router-dom";
import SubjectHomeCard from "../Subjects/SubjectHomeCard.jsx";
import ClassHomeCard from "../Pages/ClassHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";

import { GetAllSubjects } from "../Subjects/SubjectsComponents/GetAllSubjects.js";
import { Hand } from "lucide-react";
export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const getAllClasses = async () => {
      const res = await api.get("/class");
      console.log(
        "got all classes to render: ",
        res?.data?.getAllClasses || []
      );
      setClasses(res?.data?.getAllClasses);
      setLoading(false);
    };
    getAllClasses();
  }, []);
  if (loading) return <Loading loading={loading} />;
  console.log(typeof classes);
  return (
    <div className="mx-auto">
      <button
        onClick={() => navigate("/add-class")}
        className="btn btn-primary"
      >
        Add Class
      </button>
      <MainPageHeading />
      <div className="row">
        {classes.map((cl) => (
          <div key={cl._id} className="col-md-2 col-2">
            <ClassHomeCard subject={cl} navigate={navigate} />
          </div>
        ))}
      </div>
    </div>
  );
}
