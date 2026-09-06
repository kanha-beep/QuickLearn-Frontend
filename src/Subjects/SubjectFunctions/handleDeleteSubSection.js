export const handleDeleteSubsection = async (subsectionKeyToDelete) => {
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