import React from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";

export function GoToAddChapterButton({
  navigate,
  _id,
  subjectId,
  classId,
  subjectName,
  className = "",
}) {
  const { classId: routeClassId } = useParams();
  const effectiveClassId = classId || routeClassId;
  const effectiveSubjectId = subjectId || _id;

  return (
    <button
      type="button"
      disabled={!effectiveClassId || !effectiveSubjectId}
      onClick={() =>
        navigate(`/${effectiveClassId}/${effectiveSubjectId}/add-chapters`, {
          state: { subjectName },
        })
      }
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <Plus className="h-4 w-4" />
      <span>Add Chapter</span>
    </button>
  );
}
