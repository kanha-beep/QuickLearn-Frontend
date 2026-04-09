import React from "react";

export default function ChapterNameButton({ c, handleSections, onChapterSelect }) {
  return (
    <div>
      <button
        className="btn btn-primary"
        style={{ minWidth: "200%" }}
        onClick={() => {
          handleSections(c?._id);
          if (typeof onChapterSelect === "function") onChapterSelect(c);
        }}
      >
        {c?.chapter_name}
      </button>
    </div>
  );
}
