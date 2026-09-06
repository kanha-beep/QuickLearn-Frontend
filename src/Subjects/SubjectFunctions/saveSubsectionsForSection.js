  // Saves the complete subsection list for the active section to the server.
 export  const saveSubsectionsForSection = async (updatedSubsections) => {
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