import React from "react";

export function SubjectCard({ subjectName, chaptersCount }) {
  return (
    <div className="rounded border">
      <div className="row">
        <div className="col-3"> / classId / subjects / subjectId / chapters</div>
        <div className="col-4 text-center">
          <h2>{subjectName.toUpperCase()}</h2>
        </div>
        <div className="col-5 d-flex align-items-center text-center">
          <span>No of Chapters:</span>
          <b className="ms-2">{chaptersCount}</b>
        </div>
      </div>
    </div>
  );
}
