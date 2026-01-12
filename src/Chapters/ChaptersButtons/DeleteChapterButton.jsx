import React from "react";

export function DeleteChapterButton({ handleDeleteChapter, chapter }) {
  return (
    <div>
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => handleDeleteChapter(chapter?._id)}
      >
        <span className="bi bi-trash fs-7"></span>
      </button>
    </div>
  );
}
