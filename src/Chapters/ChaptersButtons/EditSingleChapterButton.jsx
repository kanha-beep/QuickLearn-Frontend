import React from "react";

export function EditSingleChapterButton({ navigate, subjectId, c, classId }) {
  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/${classId}/subjects/${subjectId}/chapters/${c?._id}/edit`,
            {
              state: {
                subjectId: subjectId,
                chapterId: c._id,
                chapterN: c.chapter_name,
              },
            }
          )
        }
        className="btn btn-outline-success btn-sm"
      >
        <span className="bi bi-pencil fs-7"></span>
      </button>
    </div>
  );
}
