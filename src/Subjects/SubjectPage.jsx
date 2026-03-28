import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { api } from "../../api.js";
import { GetChapters } from "../Chapters/ChaptersComponents/GetChapters.js";
import { DeleteChapter } from "../Chapters/ChaptersComponents/DeleteChapter.js";

const formatContent = (content = []) => {
  if (Array.isArray(content)) return content.filter(Boolean);
  if (typeof content === "string") {
    return content
      .split(/\n|\./)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export default function SubjectPage() {
  const { chapterId, subjectId, classId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [subjectName, setSubjectName] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [activeChapterId, setActiveChapterId] = useState(chapterId || null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeSubsectionId, setActiveSubsectionId] = useState(null);
  const [loadingSections, setLoadingSections] = useState(false);
  const [editingSubsectionId, setEditingSubsectionId] = useState(null);
  const [subsectionForm, setSubsectionForm] = useState({
    order: "",
    subsection_name: "",
    subsection_content: "",
  });

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin =
    localStorage.getItem("roles") === "admin" || parsedUser?.roles === "admin";

  useEffect(() => {
    GetChapters(api, subjectId, () => {}, setChaptersList, setSubjectName);
  }, [subjectId]);

  useEffect(() => {
    if (!chapterId) return;
    handleChapterToggle(chapterId);
  }, [chapterId]);

  const normalizedQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const filteredChapters = useMemo(() => {
    return chaptersList.filter((chapter) => {
      const chapterName = (chapter?.chapter_name ?? "").toString().toLowerCase();
      const order = (chapter?.order ?? "").toString().toLowerCase();
      return chapterName.includes(normalizedQuery) || order.includes(normalizedQuery);
    });
  }, [chaptersList, normalizedQuery]);

  const activeSection = sectionsList.find((section) => section._id === activeSectionId) || null;
  const subsections = activeSection?.subsections || [];
  const activeSubsection =
    subsections.find((subsection) => String(subsection._id || subsection.order) === activeSubsectionId) || null;

  async function handleChapterToggle(nextChapterId) {
    if (activeChapterId === nextChapterId) {
      setActiveChapterId(null);
      setSectionsList([]);
      setActiveSectionId(null);
      setActiveSubsectionId(null);
      setEditingSubsectionId(null);
      return;
    }

    try {
      setLoadingSections(true);
      const res = await api.get(`/subjects/${subjectId}/chapters/${nextChapterId}/sections`);
      setSectionsList(res?.data?.sections || []);
      setActiveChapterId(nextChapterId);
      setActiveSectionId(null);
      setActiveSubsectionId(null);
      setEditingSubsectionId(null);
    } catch (error) {
      console.log("error in sections: ", error?.response?.data);
      setSectionsList([]);
    } finally {
      setLoadingSections(false);
    }
  }

  function handleSectionToggle(section) {
    if (activeSectionId === section._id) {
      setActiveSectionId(null);
      setActiveSubsectionId(null);
      setEditingSubsectionId(null);
      return;
    }

    setActiveSectionId(section._id);
    setActiveSubsectionId(null);
    setEditingSubsectionId(null);
  }

  function handleSubsectionToggle(subsection) {
    const subsectionKey = String(subsection._id || subsection.order);
    if (activeSubsectionId === subsectionKey) {
      setActiveSubsectionId(null);
      setEditingSubsectionId(null);
      return;
    }

    setActiveSubsectionId(subsectionKey);
    setEditingSubsectionId(null);
  }

  const handleDeleteChapter = async (id) => {
    await DeleteChapter(api, id, classId, subjectId, setChaptersList);
    if (activeChapterId === id) {
      setActiveChapterId(null);
      setSectionsList([]);
      setActiveSectionId(null);
      setActiveSubsectionId(null);
    }
  };

  const handleDeleteSection = async (section) => {
    try {
      await api.delete(`/subjects/${subjectId}/chapters/${section.chapter_of_section}/sections/${section._id}/delete`);
      setSectionsList((prev) => prev.filter((item) => item._id !== section._id));
      if (activeSectionId === section._id) {
        setActiveSectionId(null);
        setActiveSubsectionId(null);
      }
    } catch (error) {
      console.log("error deleting section: ", error?.response?.data?.msg);
    }
  };

  const startSubsectionEdit = (subsection) => {
    setEditingSubsectionId(String(subsection._id || subsection.order));
    setSubsectionForm({
      order: subsection?.order ?? "",
      subsection_name: subsection?.subsection_name ?? "",
      subsection_content: formatContent(subsection?.subsection_content).join("\n"),
    });
  };

  const handleDeleteSubsection = async (subsection) => {
    if (!activeSection) return;

    const nextSubsections = (activeSection.subsections || []).filter(
      (item) => String(item._id || item.order) !== String(subsection._id || subsection.order)
    );

    try {
      const res = await api.patch(
        `/subjects/${subjectId}/chapters/${activeSection.chapter_of_section}/sections/${activeSection._id}/edit`,
        {
          sectionName: activeSection.section_name,
          sectionContent: activeSection.section_content,
          order: activeSection.order,
          subsections: nextSubsections,
        }
      );

      const updatedSection = res?.data?.section;
      setSectionsList((prev) =>
        prev.map((section) => (section._id === updatedSection._id ? updatedSection : section))
      );
      setActiveSubsectionId(null);
      setEditingSubsectionId(null);
    } catch (error) {
      console.log("error deleting subsection: ", error?.response?.data?.msg);
    }
  };

  const handleSaveSubsection = async (event) => {
    event.preventDefault();
    if (!activeSection || !editingSubsectionId) return;

    const nextSubsections = (activeSection.subsections || []).map((subsection) => {
      const subsectionKey = String(subsection._id || subsection.order);
      if (subsectionKey !== editingSubsectionId) return subsection;

      return {
        ...subsection,
        order: subsectionForm.order,
        subsection_name: subsectionForm.subsection_name,
        subsection_content: subsectionForm.subsection_content,
      };
    });

    try {
      const res = await api.patch(
        `/subjects/${subjectId}/chapters/${activeSection.chapter_of_section}/sections/${activeSection._id}/edit`,
        {
          sectionName: activeSection.section_name,
          sectionContent: activeSection.section_content,
          order: activeSection.order,
          subsections: nextSubsections,
        }
      );

      const updatedSection = res?.data?.section;
      setSectionsList((prev) =>
        prev.map((section) => (section._id === updatedSection._id ? updatedSection : section))
      );
      setEditingSubsectionId(null);
    } catch (error) {
      console.log("error saving subsection: ", error?.response?.data?.msg);
    }
  };

  const explanationParagraphs = activeSubsection
    ? formatContent(activeSubsection?.subsection_content)
    : activeSection && subsections.length === 0
    ? formatContent(activeSection?.section_content)
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-1 pb-4 pt-3 text-slate-900">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-4 border bg-white p-3 shadow-sm">
          <h3 className="mb-3 text-2xl fw-semibold">Chapters</h3>
          <div className="max-h-[11rem] overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
            <div className="d-flex flex-column">
              {filteredChapters.map((chapter) => (
                <div key={chapter._id} className="my-2 rounded-4 border p-2">
                  <button
                    className="btn btn-link w-100 p-0 text-start text-decoration-none text-dark"
                    onClick={() => handleChapterToggle(chapter._id)}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <span className="w-6 text-secondary fs-5">{chapter?.order}</span>
                      <span className="fs-4 fw-semibold">{chapter?.chapter_name}</span>
                    </div>
                  </button>

                  {isAdmin && (
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() =>
                          navigate(`/${classId}/subjects/${subjectId}/chapters/${chapter._id}/edit`, {
                            state: {
                              subjectId,
                              chapterId: chapter._id,
                              chapterN: chapter.chapter_name,
                            },
                          })
                        }
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteChapter(chapter._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                      <select
                        className="form-select form-select-sm w-auto"
                        defaultValue=""
                        onChange={(event) => {
                          const value = event.target.value;
                          event.target.value = "";
                          if (!value) return;
                          navigate(`/${classId}/${subjectId}/${chapter._id}/add-sections`, {
                            state: {
                              addButton: value,
                              chapterId: chapter._id,
                              chapterName: chapter.chapter_name,
                              subjectId,
                              classId,
                              subjectName,
                            },
                          });
                        }}
                      >
                        <option value="">Add</option>
                        <option value="sections">Section</option>
                        <option value="meanings">Meanings</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-4 border bg-white p-3 shadow-sm">
          <h3 className="mb-3 text-2xl fw-semibold">Sections</h3>
          <div className="max-h-[11rem] overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
            {loadingSections ? (
              <p className="text-sm text-slate-500">Loading sections...</p>
            ) : (
              <div>
                {sectionsList.map((section) => (
                  <div key={section._id} className="my-2 rounded-4 border p-2">
                    <button
                      onClick={() => handleSectionToggle(section)}
                      className="btn btn-link w-100 p-0 text-start text-decoration-none text-dark"
                    >
                      <div className="d-flex align-items-start gap-3">
                        <span className="w-6 text-secondary fs-5">{section?.order}</span>
                        <span className="fs-4 fw-semibold">{section.section_name}</span>
                      </div>
                    </button>

                    {isAdmin && (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            navigate(
                              `/${classId}/subjects/${subjectId}/chapters/${section.chapter_of_section}/sections/${section._id}/edit`,
                              {
                                state: {
                                  subjectId,
                                  chapterId: section.chapter_of_section,
                                  sectionId: section._id,
                                },
                              }
                            )
                          }
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteSection(section)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-4 border bg-white p-3 shadow-sm">
          <h3 className="mb-3 text-2xl fw-semibold">Subsections</h3>
          <div className="max-h-[20rem] overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
            {!activeSection ? (
              <p className="text-sm text-slate-500">Select a section to view subsections.</p>
            ) : subsections.length === 0 ? (
              <p className="text-sm text-slate-500">No subsections inside this section.</p>
            ) : (
              <div>
                {subsections.map((subsection) => {
                  const subsectionKey = String(subsection._id || subsection.order);
                  const isEditing = editingSubsectionId === subsectionKey;
                  return (
                    <div key={subsectionKey} className="my-2 rounded-4 border p-2">
                      <button
                        onClick={() => handleSubsectionToggle(subsection)}
                        className="btn btn-link w-100 p-0 text-start text-decoration-none text-dark"
                      >
                        <div className="d-flex align-items-start gap-3">
                          <span className="w-6 text-secondary fs-5">{subsection?.order}</span>
                          <span className="fs-4 fw-semibold">{subsection?.subsection_name}</span>
                        </div>
                      </button>

                      {isAdmin && (
                        <div className="mt-2 d-flex flex-wrap gap-2">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => startSubsectionEdit(subsection)}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteSubsection(subsection)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      {isEditing && (
                        <form onSubmit={handleSaveSubsection} className="mt-3 space-y-2">
                          <input
                            className="form-control form-control-sm"
                            value={subsectionForm.order}
                            onChange={(event) => setSubsectionForm((prev) => ({ ...prev, order: event.target.value }))}
                            placeholder="Order"
                          />
                          <input
                            className="form-control form-control-sm"
                            value={subsectionForm.subsection_name}
                            onChange={(event) => setSubsectionForm((prev) => ({ ...prev, subsection_name: event.target.value }))}
                            placeholder="Subsection name"
                          />
                          <textarea
                            className="form-control form-control-sm"
                            rows={4}
                            value={subsectionForm.subsection_content}
                            onChange={(event) => setSubsectionForm((prev) => ({ ...prev, subsection_content: event.target.value }))}
                            placeholder="Subsection content"
                          />
                          <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-dark btn-sm">Save</button>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditingSubsectionId(null)}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-4 border bg-white p-3 shadow-sm">
          <h3 className="mb-3 text-2xl fw-semibold">Explanation</h3>
          {!activeSection ? (
            <p className="text-sm text-slate-500">Select a section to read its explanation.</p>
          ) : subsections.length > 0 && !activeSubsection ? (
            <p className="text-sm text-slate-500">Select a subsection to read its explanation.</p>
          ) : explanationParagraphs.length === 0 ? (
            <p className="text-sm text-slate-500">No explanation available.</p>
          ) : (
            <div className="space-y-3 text-sm leading-7 text-slate-700">
              {explanationParagraphs.map((item, index) => (
                <p key={`${index}-${item.slice(0, 12)}`}>{item}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate(`/${classId}`)}
          className="btn btn-outline-secondary flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Subjects</span>
        </button>
      </div>
    </div>
  );
}
