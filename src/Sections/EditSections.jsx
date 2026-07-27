import React, { useEffect } from "react";
import { api } from "../../api.js";
import { useNavigate, useParams } from "react-router-dom";
import { handleChange } from "../Components/HandleChange.js";
import { UpdateSection } from "./SectionsComponents/UpdateSection.js";
import { GetSection } from "./SectionsComponents/GetSection.js";
import { getNextOrderNumber } from "../Components/order.js";

const createEmptySubsection = (order = "") => ({
  subsection_name: "",
  subsection_content: "",
  order: String(order),
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
      GetSection(api, subjectId, chapterId, sectionId, setSectionData, setOrder);
    };
    getSectionData();
  }, [chapterId, sectionId, subjectId]);
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
        createEmptySubsection(getNextOrderNumber(prev.subsections)),
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
    <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 md:py-5">
      <div
        className="mx-auto rounded-[2rem] p-3 shadow-sm transition-all duration-300 md:p-4"
        style={{ maxWidth: "980px", background: "#ffffff" }}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Edit Section
            </span>
            <h1 className="mb-1 text-3xl font-semibold text-slate-900">Update section details</h1>
            <p className="text-slate-500">
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

        <form onSubmit={handleContentUpdate} className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
              <input
                type="number"
                placeholder="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div className="md:col-span-9">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Section name</label>
              <input
                placeholder="Section Name"
                name="sectionName"
                value={sectionData.sectionName}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                onChange={(e) => handleChange(e, setSectionData)}
              />
            </div>
            <div className="md:col-span-12">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Section content</label>
              <textarea
                rows="12"
                placeholder={
                  sectionData.subsections.length > 0
                    ? "Section content stays empty when subsections are present"
                    : "Section Content"
                }
                name="sectionContent"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                value={sectionData.sectionContent}
                onChange={(e) => handleChange(e, setSectionData)}
                disabled={sectionData.subsections.length > 0}
              />
              {sectionData.subsections.length > 0 && (
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
              <div className="rounded-[2rem] border border-dashed bg-white p-3 text-slate-500">
                No subsections yet. Add one if this section needs smaller topics.
              </div>
            )}

            <div className="flex flex-col gap-3">
              {sectionData.subsections.map((subsection, index) => (
                <div key={index} className="rounded-[2rem] border bg-white p-3 transition-all duration-200">
                  <div className="grid gap-3 md:grid-cols-12">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Order</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={subsection.order}
                        onChange={(e) =>
                          handleSubsectionChange(index, "order", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="md:col-span-10">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Subsection name</label>
                      <input
                        placeholder="Subsection Name"
                        value={subsection.subsection_name}
                        onChange={(e) =>
                          handleSubsectionChange(index, "subsection_name", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                    <div className="md:col-span-12">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Subsection content</label>
                      <textarea
                        rows="2"
                        placeholder="Subsection Content"
                        value={subsection.subsection_content}
                        onChange={(e) =>
                          handleSubsectionChange(index, "subsection_content", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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

          <div className="flex flex-wrap gap-2">
            <button className="btn btn-success w-full px-4 sm:w-auto">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
