import React from "react";

export function AddSectionButton({ navigate, c, classId, subjectId, subjectName }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    navigate(`/${classId}/${subjectId}/${c?._id}/add-sections`, {
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
    <div className="sticky top-3 z-20 self-start rounded-lg bg-white/90 p-1 backdrop-blur-sm">
      <select
        onChange={handleChange}
        defaultValue=""
        className="w-24 rounded-md border border-cyan-200 bg-cyan-50 px-2 py-1.5 text-sm font-medium text-cyan-700 outline-none transition-all duration-200 hover:bg-cyan-100 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
      >
        <option value="">+</option>
        <option value="sections">Section</option>
        <option value="meanings">Meanings</option>
      </select>
    </div>
  );
}
