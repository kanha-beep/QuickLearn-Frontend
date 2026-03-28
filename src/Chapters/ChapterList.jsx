import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AddSectionButton } from "../Sections/SectionsButtons/AddSectionButton.jsx";
import { EditSingleChapterButton } from "./ChaptersButtons/EditSingleChapterButton.jsx";
import { DeleteChapterButton } from "./ChaptersButtons/DeleteChapterButton.jsx";
import { DeleteChapter } from "../Chapters/ChaptersComponents/DeleteChapter.js";
import { api } from "./../../api.js";
export default function ChapterList({
  chapterId,
  chaptersList,
  handleSections,
  subjectId,
  classId,
  subjectName,
}) {
  console.log(
    "classId: ",
    classId,
    "subjectName: ",
    subjectName,
    "subjectId: ",
    // subjectId,
    "PERMANENT in chapterList"
  );
  // console.log("user role in list: ", localStorage.getItem("roles"));
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [globalChapterId, setGlobalChapterId] = useState("");
  const [globalChapterName, setGlobalChapterName] = useState("");
  useEffect(() => {
    setChapters(chaptersList);
  }, [chaptersList, globalChapterId]);
  const handleDeleteChapter = async (chapterId) => {
    console.log("delete started");
    await DeleteChapter(api, chapterId, classId, subjectId, setChapters);
    console.log("chapter deleted");
  };
  const [addButton, setAddButton] = useState("");
  const [addButtonValue, setAddButtonValue] = useState("");
  // console.log("chapter ID to pass------:", globalChapterId);
  console.log("all chapter CHAPTERSLIST: ", chaptersList);
  console.log(`global chapterId: , ${globalChapterId}`);
  const moveChapter = (fromIndex, toIndex) => {
    const updatedChapters = [...chapters];
    const [movedChapter] = updatedChapters.splice(fromIndex, 1);
    updatedChapters.splice(toIndex, 0, movedChapter);
    setChapters(updatedChapters);
  };
  return (
    <div className="p-0">
      <div className="d-flex flex-column">
        {chapters.map((c) => (
          <div key={c._id} className="border rounded-4 p-2 my-2">
            {/* full card */}
            <div>
              <button
                className="btn btn-link text-decoration-none text-start w-100 fs-4 fw-semibold p-0 text-dark"
                onClick={() => {
                  console.log(
                    "Clicking chapter:",
                    c.chapter_name,
                    "ID:",
                    c._id
                  );
                  setGlobalChapterId(c?._id);
                  handleSections(c._id);
                  setGlobalChapterName(c.chapter_name);
                }}
              >
                <span className="me-3 fs-5 text-secondary">{c?.order}</span>
                {c?.chapter_name}
              </button>
            </div>

            {/* navigation buttons like edit delete etc */}
            <div className="d-flex flex-wrap gap-2 mt-2">
              <div>
                <EditSingleChapterButton
                  classId={classId}
                  chapterId={chapterId}
                  subjectId={subjectId}
                  navigate={navigate}
                  c={c}
                />
              </div>
              <div>
                <DeleteChapterButton
                  chapterId={chapterId}
                  subjectId={subjectId}
                  handleDeleteChapter={handleDeleteChapter}
                  chapter={c}
                />
              </div>
              <div>
                <AddSectionButton
                  chapterId={chapterId}
                  addButton={addButton}
                  setAddButton={setAddButton}
                  addButtonValue={addButtonValue}
                  setAddButtonValue={setAddButtonValue}
                  navigate={navigate}
                  c={c}
                  subjectName={subjectName}
                  classId={classId}
                  subjectId={subjectId}
                  globalChapterId={globalChapterId}
                  globalChapterName={globalChapterName}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
