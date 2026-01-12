import React from "react";

export function AddSectionButton({
  classId,
  subjectName,
  navigate,
  c,
  subjectId,
}) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    navigate(`/${classId}}/${subjectId}/${c?._id}/add-sections`, {
      state: {
        addButton: value,
        chapterId: c._id,
        chapterName: c.chapter_name,
        subjectId,
        classId,
        subjectName,
      },
    });
  };

  return (
    <>
      <select onChange={handleChange} className="btn form-select-sm btn-outline-info btn-sm">
        <option value="">Add</option>
        <option value="sections">Section</option>
        <option value="meanings">Meanings</option>
      </select>
    </>
  );
}
