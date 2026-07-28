import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "../../api.js";
import { useChapters, useSections } from "../hooks.js";
import { HomePageButton } from "../Pages/HomePageButton.jsx";
import { EditSingleChapterButton } from "../Chapters/ChaptersButtons/EditSingleChapterButton.jsx";
import { DeleteChapterButton } from "../Chapters/ChaptersButtons/DeleteChapterButton.jsx";
import { AddSectionButton } from "../Sections/SectionsButtons/AddSectionButton.jsx";
import { GoToAddChapterButton } from "../Chapters/ChaptersButtons/GoToAddChapterButton.jsx";
import { EditSectionButton } from "../Sections/SectionsButtons/EditSectionButton.jsx";
import { DeleteSectionButton } from "../Sections/SectionsButtons/DeleteSectionButton.jsx";
import { DeleteSection } from "../Sections/SectionsComponents/DeleteSection.js";
import SafeRichContent, {
  hasSafeRenderableContent,
} from "../Components/SafeRichContent.jsx";

const buildSubsectionKey = (sectionId, subsection, index) =>
  subsection?._id || `${sectionId}-${index}`;

const toTextareaValue = (content = []) => {
  if (Array.isArray(content)) {
    return content
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join("\n");
  }

  return String(content || "");
};

const toContentArray = (content = "") =>
  String(content)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const getContentItems = (content = []) => {
  if (Array.isArray(content)) {
    return content.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(content || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const hasRenderedContent = (content = []) => hasSafeRenderableContent(content);

export default function SubjectPage() {
  const navigate = useNavigate();
  const { subjectId, classId } = useParams();
  const [searchParams] = useSearchParams();
  const [activeChapterId, setActiveChapterId] = useState("");
  const [editableChapters, setEditableChapters] = useState([]);
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

  const { chaptersList, chaptersCount, subjectName } = useChapters(subjectId);
  const storedRole = localStorage.getItem("roles");
  const storedUser = localStorage.getItem("user");
  const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  const isAdmin = storedRole === "admin" || userRole === "admin";
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    setEditableChapters(chaptersList);
  }, [chaptersList]);

  const filteredChapters = editableChapters.filter((chapter) =>
    chapter?.chapter_name?.toLowerCase().includes(query),
  );

  useEffect(() => {
    if (!filteredChapters.length) {
      setActiveChapterId("");
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

  const visibleSections = useMemo(
    () =>
      editableSections.filter(
        (section) => !deletedSectionIds.includes(section._id),
      ),
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
        (subsection._id || `${selectedSection?._id}-${index}`) ===
        activeSubsectionId,
    );

    if (activeSubsectionId && !activeStillExists) {
      setActiveSubsectionId("");
      setEditingSubsectionId("");
    }
  }, [sectionSubsections, activeSubsectionId, selectedSection]);

  const selectedSubsection =
    sectionSubsections.find(
      (subsection, index) =>
        (subsection._id || `${selectedSection?._id}-${index}`) ===
        activeSubsectionId,
    ) || null;
  const hasSubsections = sectionSubsections.length > 0;
  const layoutClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  const actionRowClass = "mt-2 flex flex-wrap items-center gap-2";

  const handleDeleteSection = async (sectionId) => {
    const section = visibleSections.find((item) => item._id === sectionId);
    if (!sectionId || !section?.chapter_of_section) return;

    await DeleteSection(
      api,
      subjectId,
      section.chapter_of_section,
      sectionId,
      (prevSections = []) =>
        prevSections.filter((item) => item._id !== sectionId),
    );
    setDeletedSectionIds((prev) => [...prev, sectionId]);
  };

  const handleDeleteChapter = (chapterId) => {
    setEditableChapters((prevChapters) =>
      prevChapters.filter((chapter) => chapter._id !== chapterId),
    );
    if (activeChapterId === chapterId) {
      setActiveChapterId("");
      setActiveSectionId("");
      setActiveSubsectionId("");
    }
  };

  const startEditSubsection = (subsection, index) => {
    if (!selectedSection) return;

    const subsectionKey = buildSubsectionKey(
      selectedSection._id,
      subsection,
      index,
    );
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
      console.error(
        "Error updating subsections: ",
        error?.response?.data || error,
      );
      return false;
    } finally {
      setIsSavingSubsection(false);
    }
  };

  const handleSaveSubsection = async () => {
    if (!selectedSection || !editingSubsectionId) return;

    const updatedSubsections = sectionSubsections.map((subsection, index) => {
      const subsectionKey = buildSubsectionKey(
        selectedSection._id,
        subsection,
        index,
      );
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

    const updatedSubsections = sectionSubsections.filter(
      (subsection, index) => {
        const subsectionKey = buildSubsectionKey(
          selectedSection._id,
          subsection,
          index,
        );
        return subsectionKey !== subsectionKeyToDelete;
      },
    );

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
    <motion.div
      initial={{ opacity: 0, y: -200 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 2,
        delay: 0.5,
        ease: "easeInOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <div className="mx-auto h-[43rem] w-full max-w-[95%] pt-3 text-slate-900">
        {/* chapters list */}
        <section className={`grid grid-cols-4 items-start gap-2 ${layoutClass} h-[90%]`}>
          <div className="h-full rounded-2xl border border-slate-200 p-3 shadow-sm sm:col-span-1 col-span-2 bg-white/80 overflow-auto subject-scrollbar">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-700">
                Chapters
              </div>
              {isAdmin && (
                <GoToAddChapterButton
                  navigate={navigate}
                  subjectId={subjectId}
                  classId={classId}
                  subjectName={subjectName}
                  className="w-full sm:w-auto"
                />
              )}
            </div>

            <div className="space-y-2 overflow-auto pr-1 lg:pr-0">
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
                        <DeleteChapterButton
                          chapter={chapter}
                          subjectId={subjectId}
                          onDelete={handleDeleteChapter}
                        />
                        <AddSectionButton
                          navigate={navigate}
                          c={chapter}
                          classId={classId}
                          subjectId={subjectId}
                          subjectName={subjectName}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* sections list actual div*/}
          <div className="h-full rounded-2xl border border-slate-200  px-2 py-3 sm:col-span-1 bg-white/80 col-span-2 shadow-sm overflow-auto subject-scrollbar">
            <div className="mb-3 text-sm font-semibold text-slate-700">
              Sections
            </div>
            <motion.div
            key={`${activeChapterId}-${visibleSections.length}`}
            initial={{opacity:0, y:50}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.65, delay:0.1, ease:"easeInOut"}}
            >

            
            <div className="space-y-2 overflow-y-auto pr-1 lg:pr-0">
              {visibleSections.map((section) => {
                const isActive = activeSectionId === section._id;
                return (
                  <div
                    onClick={() => {
                      if (activeSectionId === section._id) {
                        setActiveSectionId("");
                        setActiveSubsectionId("");
                        return;
                      }

                      setActiveSectionId(section._id);
                      setActiveSubsectionId("");
                    }}
                    key={section._id}
                    className={`rounded-xl border p-2 transition-color ${
                      isActive
                        ? "border-cyan-300 bg-cyan-50"
                        : "border-slate-200 hover:border-blue-500 hover:bg-blue-400/40"
                    }`}
                  >
                    <button
                      type="button"
                      // onClick={() => {
                      //   if (activeSectionId === section._id) {
                      //     setActiveSectionId("");
                      //     setActiveSubsectionId("");
                      //     return;
                      //   }

                      //   setActiveSectionId(section._id);
                      //   setActiveSubsectionId("");
                      // }}
                      className={`block h-full w-full rounded-lg break-words px-1 text-left text-base font-semibold transition-colors ${
                        isActive
                          ? "text-slate-800"
                          : "bg-transparent text-slate-800"
                      }`}
                    >
                      <span
                        className={`inline-flex w-8 shrink-0 text-xs ${
                          isActive ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
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
                  </div>
                );
              })}
            </div>
            </motion.div>
          </div>

          {selectedSection && hasSubsections ? (
            <>
              <div className="rounded-2xl border border-slate-200  bg-white/80 p-3 shadow-sm overflow-auto subject-scrollbar">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Subsections
                </div>
                <div className="max-h-[20rem] space-y-2 overflow-y-auto pr-1 lg:pr-0">
                  {sectionSubsections.map((subsection, index) => {
                    const subsectionKey = buildSubsectionKey(
                      selectedSection._id,
                      subsection,
                      index,
                    );
                    const isActive = activeSubsectionId === subsectionKey;

                    return (
                      <div
                        key={subsectionKey}
                        className={`w-full rounded-xl border p-2 text-left text-base font-semibold transition ${
                          isActive
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
                              onClick={() =>
                                startEditSubsection(subsection, index)
                              }
                              className="btn btn-sm btn-outline-primary"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSubsection(subsectionKey)
                              }
                              className="btn btn-sm btn-outline-danger"
                              disabled={isSavingSubsection}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* got the expalantion actual div box */}
              <div className="rounded-2xl border border-slate-200 p-3 shadow-sm bg-red-400 sm:bg-yellow-400  col-span-1">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-700">
                    Explanation
                  </div>
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
                          setSubsectionDraft((prev) => ({
                            ...prev,
                            order: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
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
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
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
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                ) : selectedSubsection &&
                  hasRenderedContent(selectedSubsection.subsection_content) ? (
                  <SafeRichContent
                    content={selectedSubsection.subsection_content}
                    className="prose prose-sm max-w-none text-sm text-slate-700"
                  />
                ) : hasRenderedContent(selectedSection.section_content) ? (
                  <SafeRichContent
                    content={selectedSection.section_content}
                    className="prose prose-sm max-w-none text-sm text-slate-700"
                  />
                ) : (
                  <p className="text-sm text-slate-500">Coming soon</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 col-span-2 shadow-sm sm:col-span-1">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Subsections
                </div>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
              {/* got the actual div explanation */}
              <div className="h-full rounded-2xl border border-slate-200 col-span-2 sm:col-span-1 p-3 shadow-sm overflow-auto subject-scrollbar">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Explanation
                </div>
                {selectedSection ? (
                  hasRenderedContent(selectedSection.section_content) ? (
                    <SafeRichContent
                      content={selectedSection.section_content}
                      className="prose prose-sm max-w-none text-sm text-slate-700"
                    />
                  ) : (
                    <p className="text-sm text-slate-500">Coming soon</p>
                  )
                ) : (
                  <p className="text-sm text-slate-500">Coming soon</p>
                )}
              </div>
            </>
          )}
        </section>

        <div className="mt-4">
          <HomePageButton navigate={navigate} classId={classId} />
        </div>
      </div>
    </motion.div>
  );
}
