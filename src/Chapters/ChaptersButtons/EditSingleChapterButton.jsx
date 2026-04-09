import React from "react";

export function EditSingleChapterButton({ navigate, subjectId, classId, chapter }) {
  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/${classId}/subjects/${subjectId}/chapters/${chapter?._id}/edit`,
            {
              state: {
                subjectId,
                chapterId: chapter?._id,
                chapterN: chapter?.chapter_name,
                chapterO: chapter?.order,
              },
            },
          )
        }
        className="btn btn-outline-success btn-sm"
      >
        <span className="bi bi-pencil fs-7"></span>
      </button>
    </div>
  );
}
