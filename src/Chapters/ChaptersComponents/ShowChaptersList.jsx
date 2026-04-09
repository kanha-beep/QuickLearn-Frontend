import React from "react";

export function ShowChaptersList({ chapter }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Chapter
        </p>
        <strong className="text-slate-800">{chapter?.chapter_name}</strong>
      </div>
      <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
        Order {chapter?.order}
      </span>
    </div>
  );
}
