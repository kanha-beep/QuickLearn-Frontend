import React, { useEffect } from "react";
import { api } from "../../api.js";
import { useNavigate, useParams } from "react-router-dom";
import { handleChange } from "../Components/HandleChange.js";
import { UpdateSection } from "./SectionsComponents/UpdateSection.js";
import { GetSection } from "./SectionsComponents/GetSection.js";

const createEmptySubsection = (order = "") => ({
  subsection_name: "",
  subsection_content: "",
  order,
});

export default function EditSections() {
  const [order, setOrder] = React.useState();
  const navigate = useNavigate();
  const { subjectId, chapterId, sectionId, classId } = useParams();
  console.log("EditSections props: ", subjectId, chapterId, sectionId);
  const [sectionData, setSectionData] = React.useState({
    sectionName: "",
    sectionContent: "",
    subsections: [],
  });
  useEffect(() => {
    const getSectionData = async () => {
      GetSection(api, subjectId, chapterId, sectionId, setSectionData);
    };
    getSectionData();
  }, []);
  const handleContentUpdate = async (e) => {
    UpdateSection(
      e,
      api,
      subjectId,
      chapterId,
      sectionId,
      sectionData,
      navigate,
      classId,
      order
    );
    console.log("section updated");
  };

  const handleSubsectionChange = (index, field, value) => {
    setSectionData((prev) => ({
      ...prev,
      subsections: prev.subsections.map((subsection, subsectionIndex) =>
        subsectionIndex === index
          ? { ...subsection, [field]: value }
          : subsection,
      ),
    }));
  };

  const handleAddSubsection = () => {
    setSectionData((prev) => ({
      ...prev,
      sectionContent: "",
      subsections: [
        ...prev.subsections,
        createEmptySubsection(prev.subsections.length + 1),
      ],
    }));
  };

  const handleRemoveSubsection = (indexToDelete) => {
    setSectionData((prev) => ({
      ...prev,
      subsections: prev.subsections.filter((_, index) => index !== indexToDelete),
    }));
  };

  return (
    <div className="container px-3 py-4 py-md-5 px-sm-4">
      <div
        className="mx-auto rounded-4 border-0 shadow-sm p-3 p-md-4"
        style={{ maxWidth: "980px", background: "#ffffff" }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
          <div>
            <span className="badge text-bg-warning-subtle text-warning-emphasis mb-2">
              Edit Section
            </span>
            <h1 className="h3 mb-1">Update section details</h1>
            <p className="text-muted mb-0">
              Keep the section and its subsections in one place.
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

        <form onSubmit={handleContentUpdate} className="d-flex flex-column gap-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Order</label>
              <input
                type="number"
                placeholder="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-9">
              <label className="form-label fw-semibold">Section name</label>
              <input
                placeholder="Section Name"
                name="sectionName"
                value={sectionData.sectionName}
                className="form-control"
                onChange={(e) => handleChange(e, setSectionData)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Section content</label>
              <textarea
                rows="12"
                placeholder={
                  sectionData.subsections.length > 0
                    ? "Section content stays empty when subsections are present"
                    : "Section Content"
                }
                name="sectionContent"
                className="form-control"
                value={sectionData.sectionContent}
                onChange={(e) => handleChange(e, setSectionData)}
                disabled={sectionData.subsections.length > 0}
              />
              {sectionData.subsections.length > 0 && (
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
                  Edit the nested points that belong to this section.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSubsection}
                className="btn btn-sm btn-outline-primary w-full md:w-auto"
              >
                Add Subsection
              </button>
            </div>

            {sectionData.subsections.length === 0 && (
              <div className="rounded-4 border border-dashed bg-white p-3 text-muted">
                No subsections yet. Add one if this section needs smaller topics.
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              {sectionData.subsections.map((subsection, index) => (
                <div key={index} className="rounded-4 border bg-white p-3">
                  <div className="row g-3">
                    <div className="col-md-2">
                      <label className="form-label fw-semibold">Order</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={subsection.order}
                        onChange={(e) =>
                          handleSubsectionChange(index, "order", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-10">
                      <label className="form-label fw-semibold">Subsection name</label>
                      <input
                        placeholder="Subsection Name"
                        value={subsection.subsection_name}
                        onChange={(e) =>
                          handleSubsectionChange(index, "subsection_name", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Subsection content</label>
                      <textarea
                        rows="2"
                        placeholder="Subsection Content"
                        value={subsection.subsection_content}
                        onChange={(e) =>
                          handleSubsectionChange(index, "subsection_content", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveSubsection(index)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-success w-full px-4 sm:w-auto">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
