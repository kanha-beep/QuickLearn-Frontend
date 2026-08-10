import { OpenChapterButton } from "../Pages/OpenChapterButton.jsx";
import { GoToAddChapterButton } from "../Chapters/ChaptersButtons/GoToAddChapterButton.jsx";
import { motion } from "motion/react";
export default function SubjectHomeCard({ subject, navigate, classId }) {
  // const roles = localStorage.getItem("roles");
  // const storedUser = localStorage.getItem("user");
  // const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  // const isAdmin = roles === "admin" || userRole === "admin";

  return (
    <div className="py-2">
      <motion.article
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.2, ease: "easeInOut" }}
      >
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1">
          <div className="mb-3">
            <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">
              {(subject?.subject_name ?? "").toUpperCase()}
            </h2>
          </div>
          <div className="mt-4">
            <OpenChapterButton
              navigate={navigate}
              subject={subject}
              classId={classId}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}
