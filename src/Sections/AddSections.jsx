import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { api } from "../../api.js";
import { handleChange } from "../Components/HandleChange.js";
import { AddSection } from "./SectionsComponents/AddSection.js";
import { useEffect } from "react";

const emptySectionForm = {
  sectionName: "",
  sectionContent: "",
  order: "",
  subsections: [],
};

const emptySubsectionDraft = {
  subsection_name: "",
  subsection_content: "",
  order: "",
};

export default function AddSections() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterId, subjectId, classId } = useParams();

  const whatToAdd = location.state?.addButton || "";
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

    setSections((prev) => ({
      ...prev,
      sectionContent: "",
      subsections: [...prev.subsections, subsectionDraft],
    }));
    setSubsectionDraft(emptySubsectionDraft);
  };

  const handleDeleteSubsection = (indexToDelete) => {
    setSections((prev) => ({
      ...prev,
      subsections: prev.subsections.filter((_, index) => index !== indexToDelete),
    }));
  };

  console.log("adding view for: ", sections);
  return (
    <div className="container px-3 py-4 py-md-5 px-sm-4">
      <div
        className="mx-auto rounded-4 border-0 shadow-sm p-3 p-md-4"
        style={{ maxWidth: "980px", background: "#ffffff" }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
          <div>
            <span className="badge text-bg-primary-subtle text-primary mb-2">
              {addView === "meanings" ? "Add Meaning" : "Add Section"}
            </span>
            <h1 className="h3 mb-1">
              {addView === "meanings" ? "Create a new meaning" : "Create a new section"}
            </h1>
            <p className="text-muted mb-0">
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

        <form onSubmit={handleAddSections} className="d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Order</label>
              <input
                type="number"
                name="order"
                placeholder="1"
                value={sections.order}
                onChange={(e) => handleChange(e, setSections)}
                className="form-control"
              />
            </div>
            <div className="col-md-9">
              <label className="form-label fw-semibold">
                {addView === "sections" ? "Section name" : "Word name"}
              </label>
              <input
                placeholder={
                  addView === "sections" ? "Enter section name" : "Enter word name"
                }
                value={sections.sectionName}
                name="sectionName"
                onChange={(e) => handleChange(e, setSections)}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                {addView === "sections" ? "Section content" : "Word meaning"}
              </label>
              <textarea
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
                className="form-control"
                disabled={sections.subsections.length > 0}
              />
              {sections.subsections.length > 0 && (
                <p className="mt-2 mb-0 small text-muted">
                  This section has subsections, so the main section content stays empty.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-4 p-3 p-md-4" style={{ background: "#f8fafc" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
              <div>
                <h2 className="h5 mb-1">Subsections</h2>
                <p className="text-muted mb-0">
                  Add smaller points inside this section if you need them.
                </p>
              </div>
              <span className="badge text-bg-light border">
                {sections.subsections.length} added
              </span>
            </div>

            <div className="row g-3">
              <div className="col-md-2">
                <label className="form-label fw-semibold">Order</label>
                <input
                  type="number"
                  name="order"
                  placeholder="1"
                  value={subsectionDraft.order}
                  onChange={handleSubsectionDraftChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-10">
                <label className="form-label fw-semibold">Subsection name</label>
                <input
                  name="subsection_name"
                  placeholder="Enter subsection name"
                  value={subsectionDraft.subsection_name}
                  onChange={handleSubsectionDraftChange}
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Subsection content</label>
                <textarea
                  rows="6"
                  name="subsection_content"
                  placeholder="Write subsection explanation"
                  value={subsectionDraft.subsection_content}
                  onChange={handleSubsectionDraftChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={handleAddSubsection}
                className="btn btn-outline-primary w-full sm:w-auto"
              >
                Add Subsection
              </button>
            </div>

            {sections.subsections.length > 0 && (
              <div className="mt-4 d-flex flex-column gap-3">
                {sections.subsections.map((subsection, index) => (
                  <div
                    key={`${subsection.subsection_name}-${index}`}
                    className="rounded-4 border bg-white p-3"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <div className="fw-semibold">
                          {subsection.subsection_name || `Subsection ${index + 1}`}
                        </div>
                        <div className="text-muted small">
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
                      <p className="text-muted mb-0 mt-2" style={{ whiteSpace: "pre-line" }}>
                        {subsection.subsection_content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2">
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
