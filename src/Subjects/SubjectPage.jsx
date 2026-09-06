import { useEffect, useState } from "react";
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

// Creates a stable key for a subsection, using its ID when one is available.
const buildSubsectionKey = (sectionId, subsection, index) =>
  subsection?._id || `${sectionId}-${index}`;

// Converts saved subsection content into text that can be shown in a textarea.
const toTextareaValue = (content = []) => {
  if (Array.isArray(content)) {
    return content
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join("\n");
  }

  return String(content || "");
};

// Splits textarea text into a clean array of non-empty content lines.
const toContentArray = (content = "") =>
  String(content)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

// Normalizes content into an array of non-empty text items for rendering.
const getContentItems = (content = []) => {
  if (Array.isArray(content)) {
    return content.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(content || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

// Checks whether content contains anything safe that can be displayed.
const hasRenderedContent = (content = []) => hasSafeRenderableContent(content);

// Displays a subject's chapters, sections, subsections, and their content.
export default function SubjectPage() {
  const navigate = useNavigate();
  const { subjectId, classId } = useParams();
  const [searchParams] = useSearchParams();
  // Stores the ID of the chapter currently selected by the user.
  const [activeChapterId, setActiveChapterId] = useState("");
    // Stores the ID of the section currently selected by the user.
  const [activeSectionId, setActiveSectionId] = useState("");
    // Stores the ID of the subsection currently selected by the user.
  const [activeSubsectionId, setActiveSubsectionId] = useState("");
    // Stores the ID of the subsection currently open in the editor.
  const [editingSubsectionId, setEditingSubsectionId] = useState("");
  // Stores the chapter list so it can be updated locally after changes.
  const [editableChapters, setEditableChapters] = useState([]);
  // Stores the section list so it can be updated locally after changes.
  const [allSections, setAllSections] = useState([]);
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
  //load all chapters list in editable chapters list
  useEffect(() => {
    setEditableChapters(chaptersList);
  }, [chaptersList]);
  // searched chapters
  const searchedChapters = editableChapters.filter((chapter) =>
    chapter?.chapter_name?.toLowerCase().includes(query),
  );

  useEffect(() => {
    if (!searchedChapters.length) {
      setActiveChapterId("");
      return;
    }
    // chapter opne h, ab jo search kiya, kya vo chapters me mera chapter he
    const activeChapterInSearchedChapters = searchedChapters.some(
      (chapter) => chapter._id === activeChapterId,
    );

    if (activeChapterId && !activeChapterInSearchedChapters) {
      setActiveChapterId("");
    }
  }, [searchedChapters, activeChapterId]);
  // all sections load kro and editable section me insert krdo
  const sections = useSections(subjectId, activeChapterId);
  useEffect(() => {
    setAllSections(sections);
  }, [sections]);

  useEffect(() => {
    if (!allSections.length) {
      setActiveSectionId("");
      setActiveSubsectionId("");
      return;
    }

    const activeChapterInSearchedChapters = allSections.some(
      (section) => section._id === activeSectionId,
    );

    if (activeSectionId && !activeChapterInSearchedChapters) {
      setActiveSectionId("");
      setActiveSubsectionId("");
    }
  }, [allSections, activeSectionId]);
  // get the single section object of the selected section
  const selectedSectionObject =
    allSections.find((section) => section._id === activeSectionId) || null;
  const allSectionSubsections = selectedSectionObject?.subsections || [];

  useEffect(() => {
    // if new sections has zero sub sections, than empty other things
    if (!allSectionSubsections.length) {
      setActiveSubsectionId("");
      setEditingSubsectionId("");
      return;
    }
    // returns boolean value to know if this sub-section is now also opened or not
    const activeSubsectionExists = allSectionSubsections.some(
      (subsection, index) =>
        (subsection._id || `${selectedSectionObject?._id}-${index}`) ===
        activeSubsectionId,
    );

    if (activeSubsectionId && !activeSubsectionExists) {
      setActiveSubsectionId("");
      setEditingSubsectionId("");
    }
  }, [allSectionSubsections, activeSubsectionId, selectedSectionObject]);

  // Finds the subsection whose ID matches the currently active subsection.
  const selectedSubsection =
    allSectionSubsections.find(
      (subsection, index) =>
        (subsection._id || `${selectedSectionObject?._id}-${index}`) ===
        activeSubsectionId,
    ) || null;
  const layoutClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  const actionRowClass = "mt-2 flex flex-wrap items-center gap-2";

  // Deletes a section and removes it from the sections currently shown on the page.
  const handleDeleteSection = async (sectionId) => {
    const section = allSections.find((item) => item._id === sectionId);
    if (!sectionId || !section?.chapter_of_section) return;

    await DeleteSection(
      api,
      subjectId,
      section.chapter_of_section,
      sectionId,
      setAllSections,
    );
  };

  // Removes a deleted chapter from local state and clears its active selection.
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

  // Opens the subsection editor and fills it with the selected subsection's data.
  const startEditSubsection = (subsection, index) => {
    if (!selectedSectionObject) return;

    const subsectionKey = buildSubsectionKey(
      selectedSectionObject._id,
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

  // Closes the subsection editor and clears the draft values.
  const resetSubsectionEditor = () => {
    setEditingSubsectionId("");
    setSubsectionDraft({
      subsection_name: "",
      subsection_content: "",
      order: "",
    });
  };

  // Saves the complete subsection list for the active section to the server.
  const saveSubsectionsForSection = async (updatedSubsections) => {
    if (!selectedSectionObject || !activeChapterId) return false;

    setIsSavingSubsection(true);
    try {
      await api.patch(
        `/api/subjects/${subjectId}/chapters/${activeChapterId}/sections/${selectedSectionObject._id}/edit`,
        {
          sectionName: selectedSectionObject.section_name,
          sectionContent: selectedSectionObject.section_content,
          order: selectedSectionObject.order,
          subsections: updatedSubsections,
        },
      );

      setAllSections((prevSections) =>
        prevSections.map((section) =>
          section._id === selectedSectionObject._id
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

  // Applies the edited draft to one subsection and saves the updated list.
  const handleSaveSubsection = async () => {
    if (!selectedSectionObject || !editingSubsectionId) return;

    const updatedSubsections = allSectionSubsections.map((subsection, index) => {
      const subsectionKey = buildSubsectionKey(
        selectedSectionObject._id,
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

  // Removes one subsection, saves the remaining list, and clears related selection state.
  const handleDeleteSubsection = async (subsectionKeyToDelete) => {
    if (!selectedSectionObject) return;

    const updatedSubsections = allSectionSubsections.filter(
      (subsection, index) => {
        const subsectionKey = buildSubsectionKey(
          selectedSectionObject._id,
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
      <div className="mx-auto h-[43rem] w-full max-w-[95%] pt-1 lg:mt-[2rem]  text-slate-900">
        {/* chapters list */}
        <section className={`grid grid-cols-4 items-start gap-2 ${layoutClass} h-[90%]`}>
          <div className="h-[20rem] sm:h-[20rem] md:h-full rounded-2xl border border-slate-200 px-2 py-3 shadow-sm sm:col-span-1 col-span-2 bg-white/80 overflow-auto subject-scrollbar">
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
              {searchedChapters.map((chapter) => {
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
                          setAllSections([]);
                          setActiveSectionId("");
                          setActiveSubsectionId("");
                          setEditingSubsectionId("");
                          return;
                        }
                        setAllSections([])
                        setActiveChapterId(chapter._id);
                        setActiveSectionId("");
                        setActiveSubsectionId("");
                        setEditingSubsectionId("")
                      }}
                      className="w-full break-words text-left text-base font-semibold text-slate-800"
                    >
                      <span className="inline-flex w-4 shrink-0 text-xs text-slate-500">
                        {chapter.order} <span>.</span>
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
          <div className="h-[20rem] sm:h-[20rem] md:h-full rounded-2xl border border-slate-200  px-2 py-3 sm:col-span-1 bg-white/80 col-span-2 shadow-sm overflow-auto subject-scrollbar">
            <div className="mb-3 text-sm font-semibold text-slate-700">
              Sections
            </div>
            <motion.div
            key={`${activeChapterId}-${allSections.length}`}
            initial={{opacity:0, y:50}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.2, delay:0.1, ease:"easeInOut"}}
            >

            
            <div className="space-y-2 overflow-y-auto pr-1 lg:pr-0">
              {allSections.map((section) => {
                const isActive = activeSectionId === section._id;
                return (
                  <div
                    onClick={() => {
                      if (activeSectionId === section._id) {
                        setActiveSectionId("");
                        setActiveSubsectionId("");
                        setEditingSubsectionId("")
                        return;
                      }
                      setActiveSectionId(section._id);
                      setActiveSubsectionId("");
                      setEditingSubsectionId("")
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
                        className={`inline-flex w-4 shrink-0 text-xs ${
                          isActive ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        {section.order}<span>.</span>
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

          {selectedSectionObject && allSectionSubsections.length > 0 ? (
            <>
            {/* actual div subsections */}
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-2 py-3 sm:col-span-1 col-span-2 shadow-sm h-full overflow-auto subject-scrollbar">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Subsections
                </div>
                <div className="h-full space-y-2 pr-1 lg:pr-0">
                  {allSectionSubsections.map((subsection, index) => {
                    const subsectionKey = buildSubsectionKey(
                      selectedSectionObject._id,
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
                          <span className="inline-flex w-4 shrink-0 text-xs text-slate-500">
                            {subsection.order ?? index} <span>.</span>
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
              <div className="h-full rounded-2xl border border-slate-200 p-3 shadow-sm sm:col-span-1 col-span-2 overflow-auto subject-scrollbar">
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
                ) : hasRenderedContent(selectedSectionObject.section_content) ? (
                  <SafeRichContent
                    content={selectedSectionObject.section_content}
                    className="prose prose-sm max-w-none text-sm text-slate-700"
                  />
                ) : (
                  <p className="text-sm text-slate-500">Coming soon</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="h-[20rem] sm:h-[20rem] md:h-full rounded-2xl border border-slate-200 bg-white/80 p-3 col-span-2 shadow-sm sm:col-span-1">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Subsections
                </div>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
              {/* got the actual div explanation */}
              <div className="sm:h-[20rem] md:h-full rounded-2xl border border-slate-200 col-span-2 sm:col-span-1 p-3 shadow-sm overflow-auto subject-scrollbar">
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  Explanation
                </div>
                {selectedSectionObject ? (
                  hasRenderedContent(selectedSectionObject.section_content) ? (
                    <SafeRichContent
                      content={selectedSectionObject.section_content}
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
