import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { api } from "../../api.js";
import { handleChange } from "../Components/HandleChange.js";
import { AddSection } from "./SectionsComponents/AddSection.js";
import { useEffect } from "react";
import { getNextOrderValue, resolveOrderNumber } from "../Components/order.js";
import { useSections } from "../hooks.js";

const emptySectionForm = {
  sectionName: "",
  sectionContent: "",
  order: "1",
  subsections: [],
};

const emptySubsectionDraft = {
  subsection_name: "",
  subsection_content: "",
  order: "1",
};

export default function AddSections() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterId, subjectId, classId } = useParams();

  const whatToAdd = location.state?.addButton || "";
  const existingSections = useSections(subjectId, chapterId);
  const [sections, setSections] = useState(emptySectionForm);
  const [subsectionDraft, setSubsectionDraft] = useState(emptySubsectionDraft);
  console.log(
    "chapterId",
    chapterId,
    "chapterName",
    location.state?.chapterName,
    "subjectName",
    location.state?.subjectName,
    "subject id",
    subjectId
  );
  const [addView, setAddView] = useState("");
  useEffect(() => {
    if (whatToAdd === "sections") {
      setAddView("sections");
    } else if (whatToAdd === "meanings") {
      setAddView("meanings");
    }
  }, [whatToAdd]);

  useEffect(() => {
    setSections((prev) =>
      prev.sectionName || prev.sectionContent || prev.subsections.length > 0
        ? prev
        : { ...prev, order: getNextOrderValue(existingSections) },
    );
  }, [existingSections]);

  const handleAddSections = async (e) => {
    console.log("section adding started from page: ", sections);
    AddSection(
      e,
      sections,
      api,
      subjectId,
      chapterId,
      setSections,
      navigate,
      classId
    );
    console.log("section added ended on section add page");
  };

  const handleSubsectionDraftChange = (e) => {
    const { name, value } = e.target;
    setSubsectionDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubsection = () => {
    if (!subsectionDraft.subsection_name.trim()) return;

    const resolvedOrder = resolveOrderNumber(
      subsectionDraft.order,
      sections.subsections.length + 1,
    );

    setSections((prev) => ({
      ...prev,
      sectionContent: "",
      subsections: [
        ...prev.subsections,
        { ...subsectionDraft, order: String(resolvedOrder) },
      ],
    }));
    setSubsectionDraft({
      ...emptySubsectionDraft,
      order: String(resolvedOrder + 1),
    });
  };

  const handleDeleteSubsection = (indexToDelete) => {
    setSections((prev) => ({
      ...prev,
      subsections: prev.subsections.filter((_, index) => index !== indexToDelete),
    }));
  };

  console.log("adding view for: ", sections);
  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:py-5">
      <div
        className="mx-auto rounded-[2rem] p-3 shadow-sm transition-all duration-300 md:p-4"
        style={{ maxWidth: "980px", background: "#ffffff" }}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {addView === "meanings" ? "Add Meaning" : "Add Section"}
            </span>
            <h1 className="mb-1 text-3xl font-semibold text-slate-900">
              {addView === "meanings" ? "Create a new meaning" : "Create a new section"}
            </h1>
            <p className="text-slate-500">
              Chapter: <strong>{location?.state?.chapterName || "Current chapter"}</strong>
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary w-full md:w-auto"
            onClick={() => navigate(`/${classId}/subjects/${subjectId}/chapters`)}
          >
            Back to Subject
          </button>
        </div>

        <form onSubmit={handleAddSections} className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
              <input
                type="number"
                name="order"
                placeholder="1"
                value={sections.order}
                onChange={(e) => handleChange(e, setSections)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div className="md:col-span-9">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {addView === "sections" ? "Section name" : "Word name"}
              </label>
              <input
                placeholder={
                  addView === "sections" ? "Enter section name" : "Enter word name"
                }
                value={sections.sectionName}
                name="sectionName"
                onChange={(e) => handleChange(e, setSections)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div className="md:col-span-12">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {addView === "sections" ? "" : "Word meaning"}
              </label>
              {/* <textarea
                rows="14"
                cols="30"
                placeholder={
                  sections.subsections.length > 0
                    ? "Section content stays empty when subsections are added"
                    : addView === "sections"
                      ? "Write the section explanation"
                      : "Write the meaning"
                }
                name="sectionContent"
                onChange={(e) => handleChange(e, setSections)}
                value={sections.sectionContent}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                disabled={sections.subsections.length > 0}
              /> */}
              {sections.subsections.length > 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  This section has subsections, so the main section content stays empty.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] p-3 md:p-4" style={{ background: "#f8fafc" }}>
            <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="mb-1 text-xl font-semibold text-slate-900">Subsections</h2>
                <p className="text-slate-500">
                  Add smaller points inside this section if you need them.
                </p>
              </div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {sections.subsections.length} added
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
                <input
                  type="number"
                  name="order"
                  placeholder="1"
                  value={subsectionDraft.order}
                  onChange={handleSubsectionDraftChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="md:col-span-10">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Subsection name</label>
                <input
                  name="subsection_name"
                  placeholder="Enter subsection name"
                  value={subsectionDraft.subsection_name}
                  onChange={handleSubsectionDraftChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="md:col-span-12">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Subsection content</label>
                <textarea
                  rows="6"
                  name="subsection_content"
                  placeholder="Write subsection explanation"
                  value={subsectionDraft.subsection_content}
                  onChange={handleSubsectionDraftChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="sticky top-2 z-20 mt-3 flex flex-wrap gap-2 rounded-xl bg-slate-50/95 py-2 backdrop-blur-sm">
              <button
                type="button"
                onClick={handleAddSubsection}
                className="btn btn-outline-primary w-full sm:w-auto"
              >
                Add Subsection
              </button>
            </div>

            {sections.subsections.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                {sections.subsections.map((subsection, index) => (
                  <div
                    key={`${subsection.subsection_name}-${index}`}
                    className="rounded-[2rem] border bg-white p-3 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {subsection.subsection_name || `Subsection ${index + 1}`}
                        </div>
                        <div className="text-sm text-slate-500">
                          Order: {subsection.order || index + 1}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubsection(index)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Remove
                      </button>
                    </div>
                    {subsection.subsection_content && (
                      <p
                        className="mt-2 text-slate-500"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {subsection.subsection_content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary w-full px-4 sm:w-auto">
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// setSections((prev) => {
//   const updated = [...prev];
//   updated[0] = {
//     ...updated[0],
//     [name]: value,
//     chapterId: chapterId,
//   };
//   return updated;
// });
