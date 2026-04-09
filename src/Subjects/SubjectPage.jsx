import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { api, apiRoutes } from "../../api.js";
import { useChapters, useSections } from "../hooks.js";
import { HomePageButton } from "../Pages/HomePageButton.jsx";
import { EditSingleChapterButton } from "../Chapters/ChaptersButtons/EditSingleChapterButton.jsx";
import { DeleteChapterButton } from "../Chapters/ChaptersButtons/DeleteChapterButton.jsx";
import { AddSectionButton } from "../Sections/SectionsButtons/AddSectionButton.jsx";
import { GoToAddChapterButton } from "../Chapters/ChaptersButtons/GoToAddChapterButton.jsx";
import { EditSectionButton } from "../Sections/SectionsButtons/EditSectionButton.jsx";
import { DeleteSectionButton } from "../Sections/SectionsButtons/DeleteSectionButton.jsx";
import { DeleteSection } from "../Sections/SectionsComponents/DeleteSection.js";

const buildSubsectionKey = (sectionId, subsection, index) =>
  subsection?._id || `${sectionId}-${index}`;

const toTextareaValue = (content = []) => {
  if (Array.isArray(content)) {
    return content.map((item) => String(item).trim()).filter(Boolean).join("\n");
  }

  return String(content || "");
};

const toContentArray = (content = "") =>
  String(content)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const renderContent = (content = []) => {
  if (Array.isArray(content)) {
    return content
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join("<br/><br/>");
  }

  return String(content || "")
    .split(/\n|\./)
    .map((item) => item.trim())
    .filter(Boolean)
    .join("<br/><br/>");
};

export default function SubjectPage() {
  const navigate = useNavigate();
  const { subjectId, classId } = useParams();
  const [searchParams] = useSearchParams();
  const [activeChapterId, setActiveChapterId] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("");
  const [activeSubsectionId, setActiveSubsectionId] = useState("");
  const [editableSections, setEditableSections] = useState([]);
  const [deletedSectionIds, setDeletedSectionIds] = useState([]);
  const [editingSubsectionId, setEditingSubsectionId] = useState("");
  const [subsectionDraft, setSubsectionDraft] = useState({
    subsection_name: "",
    subsection_content: "",
    order: "",
  });
  const [isSavingSubsection, setIsSavingSubsection] = useState(false);
  const [wrongSectionIds, setWrongSectionIds] = useState([]);
  const [wrongSubsectionIds, setWrongSubsectionIds] = useState([]);

  const { chaptersList, chaptersCount, subjectName } = useChapters(subjectId);
  const storedRole = localStorage.getItem("roles");
  const storedUser = localStorage.getItem("user");
  const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  const isAdmin = storedRole === "admin" || userRole === "admin";
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const filteredChapters = chaptersList.filter((chapter) =>
    chapter?.chapter_name?.toLowerCase().includes(query),
  );

  useEffect(() => {
    if (!filteredChapters.length) {
      setActiveChapterId("");
      setWrongSectionIds([]);
      setWrongSubsectionIds([]);
      return;
    }

    const activeStillExists = filteredChapters.some(
      (chapter) => chapter._id === activeChapterId,
    );

    if (activeChapterId && !activeStillExists) {
      setActiveChapterId("");
    }
  }, [filteredChapters, activeChapterId]);

  const sections = useSections(subjectId, activeChapterId);
  useEffect(() => {
    setEditableSections(sections);
  }, [sections]);

  useEffect(() => {
    if (!activeChapterId) {
      setWrongSectionIds([]);
      setWrongSubsectionIds([]);
      return;
    }

    const loadChapterStatus = async () => {
      try {
        const res = await api.get(apiRoutes.chapterHighlights(subjectId, activeChapterId));
        setWrongSectionIds(res?.data?.wrongSectionIds || []);
        setWrongSubsectionIds(res?.data?.wrongSubsectionIds || []);
      } catch (error) {
        console.log("error loading chapter status: ", error?.response?.data?.msg || error.message);
        setWrongSectionIds([]);
        setWrongSubsectionIds([]);
      }
    };

    loadChapterStatus();
  }, [subjectId, activeChapterId]);

  const visibleSections = useMemo(
    () => editableSections.filter((section) => !deletedSectionIds.includes(section._id)),
    [editableSections, deletedSectionIds],
  );

  useEffect(() => {
    if (!visibleSections.length) {
      setActiveSectionId("");
      setActiveSubsectionId("");
      return;
    }

    const activeStillExists = visibleSections.some(
      (section) => section._id === activeSectionId,
    );

    if (activeSectionId && !activeStillExists) {
      setActiveSectionId("");
      setActiveSubsectionId("");
    }
  }, [visibleSections, activeSectionId]);

  const selectedSection =
    visibleSections.find((section) => section._id === activeSectionId) || null;
  const sectionSubsections = selectedSection?.subsections || [];

  useEffect(() => {
    if (!sectionSubsections.length) {
      setActiveSubsectionId("");
      setEditingSubsectionId("");
      return;
    }

    const activeStillExists = sectionSubsections.some(
      (subsection, index) =>
        (subsection._id || `${selectedSection?._id}-${index}`) === activeSubsectionId,
    );

    if (activeSubsectionId && !activeStillExists) {
      setActiveSubsectionId("");
      setEditingSubsectionId("");
    }
  }, [sectionSubsections, activeSubsectionId, selectedSection]);

  const selectedSubsection =
    sectionSubsections.find(
      (subsection, index) =>
        (subsection._id || `${selectedSection?._id}-${index}`) === activeSubsectionId,
    ) || null;
  const hasSubsections = sectionSubsections.length > 0;
  const layoutClass = "grid-cols-2 lg:grid-cols-4";
  const actionRowClass = "mt-2 flex flex-wrap items-center gap-2";

  const handleDeleteSection = async (sectionId) => {
    const section = visibleSections.find((item) => item._id === sectionId);
    if (!sectionId || !section?.chapter_of_section) return;

    await DeleteSection(
      api,
      subjectId,
      section.chapter_of_section,
      sectionId,
      (prevSections = []) => prevSections.filter((item) => item._id !== sectionId),
    );
    setDeletedSectionIds((prev) => [...prev, sectionId]);
  };

  const startEditSubsection = (subsection, index) => {
    if (!selectedSection) return;

    const subsectionKey = buildSubsectionKey(selectedSection._id, subsection, index);
    setActiveSubsectionId(subsectionKey);
    setEditingSubsectionId(subsectionKey);
    setSubsectionDraft({
      subsection_name: subsection?.subsection_name || "",
      subsection_content: toTextareaValue(subsection?.subsection_content),
      order: subsection?.order ?? "",
    });
  };

  const resetSubsectionEditor = () => {
    setEditingSubsectionId("");
    setSubsectionDraft({
      subsection_name: "",
      subsection_content: "",
      order: "",
    });
  };

  const saveSubsectionsForSection = async (updatedSubsections) => {
    if (!selectedSection || !activeChapterId) return false;

    setIsSavingSubsection(true);
    try {
      await api.patch(
        `/api/subjects/${subjectId}/chapters/${activeChapterId}/sections/${selectedSection._id}/edit`,
        {
          sectionName: selectedSection.section_name,
          sectionContent: selectedSection.section_content,
          order: selectedSection.order,
          subsections: updatedSubsections,
        },
      );

      setEditableSections((prevSections) =>
        prevSections.map((section) =>
          section._id === selectedSection._id
            ? { ...section, subsections: updatedSubsections }
            : section,
        ),
      );
      return true;
    } catch (error) {
      console.error("Error updating subsections: ", error?.response?.data || error);
      return false;
    } finally {
      setIsSavingSubsection(false);
    }
  };

  const handleSaveSubsection = async () => {
    if (!selectedSection || !editingSubsectionId) return;

    const updatedSubsections = sectionSubsections.map((subsection, index) => {
      const subsectionKey = buildSubsectionKey(selectedSection._id, subsection, index);
      if (subsectionKey !== editingSubsectionId) {
        return subsection;
      }

      return {
        ...subsection,
        subsection_name: subsectionDraft.subsection_name.trim(),
        subsection_content: toContentArray(subsectionDraft.subsection_content),
        order: subsectionDraft.order,
      };
    });

    const saved = await saveSubsectionsForSection(updatedSubsections);
    if (saved) {
      resetSubsectionEditor();
    }
  };

  const handleDeleteSubsection = async (subsectionKeyToDelete) => {
    if (!selectedSection) return;

    const updatedSubsections = sectionSubsections.filter((subsection, index) => {
      const subsectionKey = buildSubsectionKey(selectedSection._id, subsection, index);
      return subsectionKey !== subsectionKeyToDelete;
    });

    const saved = await saveSubsectionsForSection(updatedSubsections);
    if (!saved) return;

    if (activeSubsectionId === subsectionKeyToDelete) {
      setActiveSubsectionId("");
    }
    if (editingSubsectionId === subsectionKeyToDelete) {
      resetSubsectionEditor();
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-1 pb-4 pt-3 text-slate-900">
      {isAdmin && (
        <div className="mb-3 flex justify-end">
          <GoToAddChapterButton
            navigate={navigate}
            subjectId={subjectId}
            classId={classId}
            subjectName={subjectName}
          />
        </div>
      )}

      <section className={`grid gap-3 ${layoutClass}`}>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-slate-700">Chapters</div>
          <div className="max-h-[11rem] space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
            {filteredChapters.map((chapter) => {
              const isActive = activeChapterId === chapter._id;
              return (
                <div
                  key={chapter._id}
                  className={`rounded-xl border p-2 transition ${
                    isActive
                      ? "border-cyan-300 bg-cyan-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (activeChapterId === chapter._id) {
                        setActiveChapterId("");
                        setActiveSectionId("");
                        setActiveSubsectionId("");
                        return;
                      }

                      setActiveChapterId(chapter._id);
                      setActiveSectionId("");
                      setActiveSubsectionId("");
                    }}
                    className="w-full break-words text-left text-base font-semibold text-slate-800"
                  >
                    <span className="inline-flex w-8 shrink-0 text-xs text-slate-500 sm:mr-5">
                      {chapter.order}
                    </span>
                    {chapter.chapter_name}
                  </button>

                  {isAdmin && isActive && (
                    <div className={actionRowClass}>
                      <EditSingleChapterButton
                        navigate={navigate}
                        subjectId={subjectId}
                        classId={classId}
                        chapter={chapter}
                      />
                      <DeleteChapterButton chapter={chapter} subjectId={subjectId} />
                      <AddSectionButton
                        navigate={navigate}
                        c={chapter}
                        classId={classId}
                        subjectId={subjectId}
                        subjectName={subjectName}
                      />
                    </div>
                  )}

                  {isActive && (
                    <div className={`${actionRowClass} ${isAdmin ? "" : "mt-3"}`}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/${classId}/subjects/${subjectId}/chapters/${chapter._id}/test`, {
                            state: {
                              chapterName: chapter.chapter_name,
                              autostart: true,
                            },
                          })
                        }
                        className="btn btn-sm btn-outline-dark"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ClipboardCheck size={14} />
                          <span>Test</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-slate-700">Sections</div>
          <div className="max-h-[11rem] space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
            {visibleSections.map((section) => {
              const isActive = activeSectionId === section._id;
              return (
                <div
                  key={section._id}
                  className={`rounded-xl border p-2 transition ${
                    wrongSectionIds.includes(section._id)
                      ? "border-rose-300 bg-rose-50"
                      : isActive
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSectionId === section._id) {
                        setActiveSectionId("");
                        setActiveSubsectionId("");
                        return;
                      }

                      setActiveSectionId(section._id);
                      setActiveSubsectionId("");
                    }}
                    className="w-full break-words text-left text-base font-semibold text-slate-800"
                  >
                    <span className="inline-flex w-8 shrink-0 text-xs text-slate-500">
                      {section.order}
                    </span>
                    {section.section_name}
                  </button>

                  {isAdmin && isActive && (
                    <div className={actionRowClass}>
                      <EditSectionButton
                        navigate={navigate}
                        section={section}
                        subjectId={subjectId}
                        classId={classId}
                      />
                      <DeleteSectionButton
                        handleDeleteSection={handleDeleteSection}
                        section={section}
                      />
                    </div>
                  )}

                  {wrongSectionIds.includes(section._id) && (
                    <p className="mt-2 mb-0 text-xs font-semibold text-rose-700">
                      Revise this section. You answered it wrong in your last test.
                    </p>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {selectedSection && hasSubsections ? (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-700">Subsections</div>
              <div className="max-h-[20rem] space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
                {sectionSubsections.map((subsection, index) => {
                  const subsectionKey =
                    buildSubsectionKey(selectedSection._id, subsection, index);
                  const isActive = activeSubsectionId === subsectionKey;

                  return (
                    <div
                      key={subsectionKey}
                      className={`w-full rounded-xl border p-2 text-left text-base font-semibold transition ${
                        wrongSubsectionIds.includes(subsectionKey)
                          ? "border-rose-300 bg-rose-50 text-rose-900"
                          : isActive
                          ? "border-amber-300 bg-amber-50 text-amber-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (activeSubsectionId === subsectionKey) {
                            setActiveSubsectionId("");
                            return;
                          }

                          setActiveSubsectionId(subsectionKey);
                        }}
                        className="w-full text-left break-words"
                      >
                        <span className="inline-flex w-8 shrink-0 text-xs text-slate-500">
                          {subsection.order ?? index}
                        </span>
                        {subsection.subsection_name}
                      </button>

                      {isAdmin && isActive && (
                        <div className={actionRowClass}>
                          <button
                            type="button"
                            onClick={() => startEditSubsection(subsection, index)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubsection(subsectionKey)}
                            className="btn btn-sm btn-outline-danger"
                            disabled={isSavingSubsection}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {wrongSubsectionIds.includes(subsectionKey) && (
                        <p className="mt-2 mb-0 text-xs font-semibold text-rose-700">
                          Revise this subsection. You answered it wrong in your last test.
                        </p>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-700">Explanation</div>
                {isAdmin && editingSubsectionId && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={resetSubsectionEditor}
                      className="btn btn-sm btn-outline-secondary"
                      disabled={isSavingSubsection}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSubsection}
                      className="btn btn-sm btn-success"
                      disabled={isSavingSubsection}
                    >
                      {isSavingSubsection ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              {isAdmin && editingSubsectionId ? (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Order
                    </label>
                    <input
                      type="number"
                      value={subsectionDraft.order}
                      onChange={(e) =>
                        setSubsectionDraft((prev) => ({ ...prev, order: e.target.value }))
                      }
                      className="form-control form-control-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Subsection Name
                    </label>
                    <input
                      type="text"
                      value={subsectionDraft.subsection_name}
                      onChange={(e) =>
                        setSubsectionDraft((prev) => ({
                          ...prev,
                          subsection_name: e.target.value,
                        }))
                      }
                      className="form-control form-control-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">
                      Subsection Content
                    </label>
                    <textarea
                      rows="5"
                      value={subsectionDraft.subsection_content}
                      onChange={(e) =>
                        setSubsectionDraft((prev) => ({
                          ...prev,
                          subsection_content: e.target.value,
                        }))
                      }
                      className="form-control"
                    />
                  </div>
                </div>
              ) : (
                selectedSubsection ? (
                  <div
                    className="prose prose-sm max-w-none text-sm text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html: renderContent(selectedSubsection.subsection_content),
                    }}
                  />
                ) : (
                  <p className="text-sm text-slate-500">
                    Select a subsection to read its explanation.
                  </p>
                )
              )}
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-700">Subsections</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-700">
                Explanation
              </div>
              {selectedSection ? (
                <div
                  className="prose prose-sm max-w-none text-sm text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: renderContent(selectedSection.section_content),
                  }}
                />
              ) : (
                <p className="text-sm text-slate-500">
                  Select a section to read its explanation.
                </p>
              )}
            </div>
          </>
        )}
      </section>

      <div className="mt-4">
        <HomePageButton navigate={navigate} classId={classId} />
      </div>
    </div>
  );
}
