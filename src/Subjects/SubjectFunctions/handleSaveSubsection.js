export const handleSaveSubsection = async () => {
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