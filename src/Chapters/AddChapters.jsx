import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { api } from "../../api";
import { useParams } from "react-router-dom";
import { AddChapterToList } from "./ChaptersComponents/AddChapterToList.js";
import { AddChapter } from "./ChaptersComponents/AddChapter.js";
import { ShowChaptersList } from "./ChaptersComponents/ShowChaptersList.jsx";
import { SaveChapterButton } from "./ChaptersButtons/SaveChapterButton.jsx";
import { AddChapterButton } from "./ChaptersButtons/AddChapterButton.jsx";

export default function AddChapters() {
  const navigate = useNavigate();
  const { subjectId, classId } = useParams();
  const [order, setOrder] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  const [chapterName, setChapterName] = useState("");

  const handleAddChapter = () => {
    AddChapterToList(
      chapterName,
      order,
      setChaptersList,
      setChapterName,
      setOrder,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    AddChapter(
      classId,
      chaptersList,
      api,
      subjectId,
      setChaptersList,
      setChapterName,
      navigate,
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-cyan-50 p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Chapter Builder
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add Chapters
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Queue one or more chapters, then save them together.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Chapter Name
              </label>
              <input
                type="text"
                placeholder="Enter chapter name"
                value={chapterName}
                onChange={(e) => setChapterName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Order
              </label>
              <input
                type="number"
                placeholder="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <AddChapterButton handleAddChapter={handleAddChapter} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <h2 className="text-sm font-semibold text-slate-800">
                Pending Chapters
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {chaptersList.length} queued
              </span>
            </div>

            <div className="space-y-3">
              {chaptersList.length > 0 ? (
                chaptersList.map((chapter, index) => (
                  <ShowChaptersList key={`${chapter.chapter_name}-${index}`} chapter={chapter} />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Add chapters to preview them here before saving.
                </p>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <SaveChapterButton />
          </div>
        </form>
      </div>
    </div>
  );
}
