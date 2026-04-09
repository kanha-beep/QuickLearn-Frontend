export const AddChapterToList = (
  chapterName,
  order,
  setChaptersList,
  setChapterName,
  setOrder,
) => {
  const trimmedName = chapterName.trim();
  if (!trimmedName) return;

  setChaptersList((prev) => [
    ...prev,
    {
      chapter_name: trimmedName,
      order: order ? Number(order) : prev.length + 1,
    },
  ]);

  setChapterName("");
  setOrder("");
};
