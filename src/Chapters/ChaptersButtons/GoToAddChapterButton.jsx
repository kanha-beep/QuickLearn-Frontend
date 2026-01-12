import React from "react";
import { ArrowLeft } from "lucide-react";
export function GoToAddChapterButton({
  navigate,
  subjectId,
  classId,
  subjectName,
}) {
  return (
    <div>
      <button
        onClick={() =>
          navigate(`/${classId}/${subjectId}/add-chapters`, {
            state: { subjectName: subjectName },
          })
        }
        className="btn btn-outline-danger"
      >
        {/* <ArrowLeft className="w-5 h-5" /> */}
        <span>Add Chapters</span>
      </button>
    </div>
  );
}
