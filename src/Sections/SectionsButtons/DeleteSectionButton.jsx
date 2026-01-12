import React from "react";

export function DeleteSectionButton({ handleDeleteSection, section }) {
  return (
    <div>
      {" "}
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() =>
          handleDeleteSection(section?.chapter_of_section, section?._id)
        }
      >
        <span className="bi bi-trash"></span>
      </button>
    </div>
  );
}
