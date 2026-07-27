import React from "react";

export function SubjectName({ subject }) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-slate-900">{subject?.subject_name}</h2>
    </div>
  );
}
