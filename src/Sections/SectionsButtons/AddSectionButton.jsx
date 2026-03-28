export function AddSectionButton({ classId, subjectName, navigate, c, subjectId }) {
  const handleChange = (event) => {
    const value = event.target.value;
    event.target.value = "";
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
    <select onChange={handleChange} className="form-select form-select-sm w-auto">
      <option value="">Add</option>
      <option value="sections">Section</option>
      <option value="meanings">Meanings</option>
    </select>
  );
}
