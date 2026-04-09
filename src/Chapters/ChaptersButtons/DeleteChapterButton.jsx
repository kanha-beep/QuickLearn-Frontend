import React from "react";
import { useDeleteChapter } from "../../hooks";

export function DeleteChapterButton({ chapter, subjectId }) {
  const deleteChapter = useDeleteChapter();
  return (
    <div>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => deleteChapter(subjectId, chapter?._id)}
      >
        <span className="bi bi-trash fs-7"></span>
      </button>
    </div>
  );
}
