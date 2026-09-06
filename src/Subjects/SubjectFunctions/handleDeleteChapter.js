export const handleDeleteChapter = (chapterId) => {
    setEditableChapters((prevChapters) =>
      prevChapters.filter((chapter) => chapter._id !== chapterId),
    );
    if (activeChapterId === chapterId) {
      setActiveChapterId("");
      setActiveSectionId("");
      setActiveSubsectionId("");
    }
  };