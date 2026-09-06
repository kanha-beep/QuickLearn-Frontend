  // Deletes a section and removes it from the sections currently shown on the page.
export  const handleDeleteSection = async (sectionId) => {
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