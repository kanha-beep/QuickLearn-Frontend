import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { api } from "../../api.js";
import ClassHomeCard from "../Pages/ClassHomeCard.jsx";
import { Loading } from "../Components/Loading.jsx";
import { MainPageHeading } from "../Pages/MainPageHeading.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const getAllClasses = async () => {
      try {
        const res = await api.get("/api/class");
        setClasses(res?.data?.getAllClasses || []);
      } catch (error) {
        console.error(
          "Failed to load classes:",
          error?.response?.data?.name || error,
        );
        setError(error?.response?.data?.name || "RUko");
        setClasses([]);
      } finally {
        setLoading(false);
      }
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
    <>
      {error && (
        <div className="w-full text-center">
          <div className="w-[80%] mx-auto text-center uppercase font-bold bg-green-300/50 rounded-lg m-3 p-3">
            {error}
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: "easeInOut",
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
      >
        <div className="mx-auto w-full max-w-7xl p-3 sm:px-4 h-[44rem]">
          <MainPageHeading />

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              {filteredClasses.length} class
              {filteredClasses.length !== 1 ? "es" : ""}
            </p>
          </div>

          <motion.div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" initial={{opacity:0, y:-25}} whileInView={{opacity:1, y:0}}>
            {filteredClasses.map((cl, index) => (
              <div key={cl._id} className="min-w-0">
                <ClassHomeCard subject={cl} navigate={navigate} index={index} />
              </div>
            ))}
          </motion.div>

          {filteredClasses.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No class found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another keyword or create a new class.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
