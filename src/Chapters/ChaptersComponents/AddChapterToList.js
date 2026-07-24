import { resolveOrderNumber } from "../../Components/order.js";

export const AddChapterToList = (
  chapterName,
  order,
  fallbackOrder,
  setChaptersList,
  setChapterName,
) => {
  const trimmedName = chapterName.trim();
  if (!trimmedName) return null;

  const resolvedOrder = resolveOrderNumber(order, fallbackOrder);
  setChaptersList((prev) => [
    ...prev,
    {
      chapter_name: trimmedName,
      order: resolvedOrder,
    },
  ]);

  setChapterName("");
  return String(resolvedOrder + 1);
};
