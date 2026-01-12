import { useEffect, useState } from "react";

import ChapterList from "../Chapters/ChapterList.jsx";
import SectionsList from "../Sections/SectionsList.jsx";
import SectionsSummary from "../Sections/SectionsSummary.jsx";
// import Timeline from "../Components/Timeline.jsx";
import { DeleteSection } from "../Sections/SectionsComponents/DeleteSection.js";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api.js";
import { EditSection } from "../Sections/SectionsComponents/EditSection.js";
import { GetChapters } from "../Chapters/ChaptersComponents/GetChapters.js";
import { HandleSections } from "../Sections/SectionsComponents/HandleSection.js";
import { HomePageButton } from "../Pages/HomePageButton.jsx";

import { GoToAddChapterButton } from "../Chapters/ChaptersButtons/GoToAddChapterButton.jsx";
import { SubjectCard } from "./SubjectCard.jsx";
export default function SubjectPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const { classId } = useParams();
  console.log("classId:", classId);
  const [subjectName, setSubjectName] = useState("");
  // console.log("Subject ID from params working:", _id);
  const [chaptersList, setChaptersList] = useState([]);
  const [chaptersCount, setChapterCount] = useState(0);
  const [sectionContent, setSectionContent] = useState(null);
  const [query, setQuery] = useState("");
  const [openChapterId, setOpenChapterId] = useState(null);
  const [onClickedSectionId, setOnClickedSectionId] = useState(false);

  // get chapters
  const getChapters = async () => {
    GetChapters(
      api,
      subjectId,
      setChapterCount,
      setChaptersList,
      setSubjectName
    );
  };
  // get section id to open or close
  const onOpenClose = (sectionId) => {
    // console.log("want this: ", sectionId);
    setOnClickedSectionId(sectionId);
  };
  console.log("got section id: ", onClickedSectionId);
  // open all chapters
  useEffect(() => {
    console.log("useEffect triggered with subjectId:", subjectId);
    if (!subjectId) {
      console.log("No subjectId, returning early");
      return;
    }
    const fetchChapters = async () => {
      try {
        console.log("About to call getChapters");
        await getChapters();
        console.log("getChapters completed");
      } catch (err) {
        console.error("Error in fetchChapters:", err);
      }
    };
    fetchChapters();
  }, [subjectId]);

  const [sectionsList, setSectionsList] = useState([]);
  // section on off
  const handleSections = async (chapterId) => {
    HandleSections(
      openChapterId,
      chapterId,
      setOpenChapterId,
      setSectionsList,
      api,
      subjectId
    );
  };
  // add section
  const handleAddSections = () => {};
  // edit section
  const handleEditContent = async (chapterId, sectionId) => {
    EditSection(api, subjectId, chapterId, sectionId);
    console.log("section deleted");
  };
  // delete section
  const handleDeleteSection = async (chapterId, sectionId) => {
    console.log("start of deleting section");
    DeleteSection(
      api,
      subjectId,
      chapterId,
      sectionId,
      getChapters,
      setSectionsList
    );
    console.log("section deleted");
  };
  // true or false
  const onClickId = () => {
    setOnClickedSectionId(!onClickedSectionId);
    console.log("onClickedSectionId: ", onClickedSectionId);
  };
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % chaptersList.length);
  const prev = () =>
    setIndex((index - 1 + chaptersList.length) % chaptersList.length);
  const filtered = chaptersList.filter((ch) =>
    ch.chapter_name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setIndex(0);
  }, [query]);

  const visibleChapter = filtered[index];
  return (
    <div className="">
      <SubjectCard subjectName={subjectName} chaptersCount={chaptersCount} />
      <div className="my-2">
        {/* prev next search */}
        <div className="row">
          <div className="col-2">
            <button className="btn btn-primary" onClick={prev}>
              Prev
            </button>
            <button className="btn btn-primary ms-2" onClick={next}>
              Next
            </button>
          </div>
          <div className="col-5">
            <input
              className="form-control"
              placeholder="Search chapter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-3" style={{ marginLeft: "8rem" }}>
            <GoToAddChapterButton
              classId={classId}
              navigate={navigate}
              subjectId={subjectId}
              subjectName={subjectName}
            />
          </div>
        </div>
        <div className="row my-2">
          <ChapterList
            chapterId={chapterId}
            handleSections={handleSections}
            // chaptersList={chaptersList}
            chaptersList={visibleChapter ? [visibleChapter] : []}
            handleAddSections={handleAddSections}
            subjectId={subjectId}
            classId={classId}
            subjectName={subjectName}
          />
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4" style={{width:"25.5rem"}}>
            <SectionsList
              classId={classId}
              subjectId={subjectId}
              chapterId={chapterId}
              handleEditContent={handleEditContent}
              sectionsList={sectionsList}
              onClickId={onClickId}
              handleDeleteSection={handleDeleteSection}
              onOpenClose={onOpenClose}
              sectionContent={sectionContent}
              setSectionContent={setSectionContent}
            />
          </div>
          <div className="col-sm-12 col-md-6 col-lg-3">
            <SectionsSummary
              _id={subjectId}
              sectionsList={sectionsList}
              sectionContent={sectionContent}
            />
          </div>
        </div>
      </div>
      <HomePageButton navigate={navigate} classId={classId} />
    </div>
  );
}
