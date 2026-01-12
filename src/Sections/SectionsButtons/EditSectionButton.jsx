import React from "react";

export function EditSectionButton({ navigate, subjectId, section, classId }) {
  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/${classId}/subjects/${subjectId}/chapters/${section?.chapter_of_section}/sections/${section?._id}/edit`,
            {
              state: {
                subjectId: subjectId,
                chapterId: section?.chapter_of_section,
                sectionId: section?._id,
              },
            }
          )
        }
        className="btn btn-outline-secondary btn-sm me-2"
      >
        <span className="bi bi-pencil fs-7"></span>
      </button>
    </div>
  );
}
