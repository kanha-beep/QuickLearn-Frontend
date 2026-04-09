import React, { useState } from "react";
import { UserContext } from "./UserContext.js";
import { useMemo } from "react";
export const UserContextProvider = ({ children }) => {
  const [sectionContent, setSectionContent] = useState(null);
  // const [query, setQuery] = useState("");
  const [openChapterId, setOpenChapterId] = useState(null);
  const [onClickedSectionId, setOnClickedSectionId] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [globalChapterId, setGlobalChapterId] = useState("");
  const [globalChapterName, setGlobalChapterName] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [sectionsList, setSectionsList] = useState([]);
  const [openSectionId, setOpenSectionId] = useState(null);
  const [section, setSection] = useState(null);
  const [order, setOrder] = useState("");

  const value = useMemo(
    () => ({
      order,
      setOrder,
      section,
      setSection,
      openSectionId,
      setOpenSectionId,
      sectionsList,
      setSectionsList,
      chapterId,
      setChapterId,
      classId,
      setClassId,
      subjectName,
      setSubjectName,
      subjectId,
      setSubjectId,
      sectionContent,
      setSectionContent,
      // query,
      // setQuery,
      openChapterId,
      setOpenChapterId,
      onClickedSectionId,
      setOnClickedSectionId,
      chapters,
      setChapters,
      globalChapterId,
      setGlobalChapterId,
      globalChapterName,
      setGlobalChapterName,
    }),
    [
      order,
      section,
      openSectionId,
      sectionsList,
      chapterId,
      classId,
      subjectName,
      subjectId,
      sectionContent,
      // query,
      openChapterId,
      onClickedSectionId,
      chapters,
      globalChapterId,
      globalChapterName,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
