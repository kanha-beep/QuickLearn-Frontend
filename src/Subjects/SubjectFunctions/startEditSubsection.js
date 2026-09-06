  // Opens the subsection editor and fills it with the selected subsection's data.
export const startEditSubsection = (subsection, index) => {
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