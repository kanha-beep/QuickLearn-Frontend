import React from "react";
import { ArrowRight } from "lucide-react";

export function OpenChapterButton({ navigate, subject, classId }) {
  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
      onClick={() =>
        navigate(`/${classId}/subjects/${subject._id}/chapters`, {
          state: {
            subjectId: subject?._id,
            subjectName: subject?.subject_name,
            classId: classId,
          },
        })
      }
    >
      Open Chapters
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}
