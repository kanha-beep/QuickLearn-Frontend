import React from "react";

export function OpenSubjectButton({ navigate, cl }) {
  return (
    <div>
      <button
        className="btn btn-outline-success"
        onClick={() => navigate(`/${cl._id}`, { state: cl?._id })}
      >
        Open Subjects →
      </button>
    </div>
  );
}
