import React from "react";

export function OpenChapterButton({ navigate, subject, classId}) {
  return (
    <div>
      <button
        className="btn btn-outline-success"
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
        Open Chapters →
      </button>
    </div>
  );
}
