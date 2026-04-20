import React from "react";
import { useDeleteChapter } from "../../hooks";

export function DeleteChapterButton({ chapter, subjectId, onDelete }) {
  const deleteChapter = useDeleteChapter();
  return (
    <div>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={async () => {
          await deleteChapter(subjectId, chapter?._id);
          if (typeof onDelete === "function") {
            onDelete(chapter?._id);
          }
        }}
      >
        <span className="bi bi-trash fs-7"></span>
      </button>
    </div>
  );
}
