import React from "react";

export function AddChapterButton({ handleAddChapter }) {
  return (
    <div>
      <button
        onClick={handleAddChapter}
        type="button"
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Add To List
      </button>
    </div>
  );
}
