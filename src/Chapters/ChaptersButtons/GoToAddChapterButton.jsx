import React from "react";
import { useParams } from "react-router-dom";

export function GoToAddChapterButton({
  navigate,
  _id,
  subjectId,
  classId,
  subjectName,
}) {
  const { classId: routeClassId } = useParams();
  const effectiveClassId = classId || routeClassId;
  const effectiveSubjectId = subjectId || _id;

  return (
    <div>
      <button
        disabled={!effectiveClassId || !effectiveSubjectId}
        onClick={() =>
          navigate(`/${effectiveClassId}/${effectiveSubjectId}/add-chapters`, {
            state: { subjectName },
          })
        }
        className="btn btn-outline-danger"
      >
        <span>Add Chapters</span>
      </button>
    </div>
  );
}
