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
    <div className="border rounded p-2">
      {/* <h3 className="mb-4 text-center">Chapters</h3> */}
      <div className="d-flex">
        {chapters.map((c) => (
          <div key={c._id} className="border rounded p-1 my-2 d-flex">
            {/* full card */}
            <div className="col-3">
              <button
                className="btn btn-primary"
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
                {c?.chapter_name}
              </button>
            </div>

            {/* navigation buttons like edit delete etc */}
            <div className="row rounded" style={{ width: "20rem" }}>
              <div className="col-3">
                <EditSingleChapterButton
                  classId={classId}
                  chapterId={chapterId}
                  subjectId={subjectId}
                  navigate={navigate}
                  c={c}
                />
              </div>
              <div className="col-3">
                <DeleteChapterButton
                  chapterId={chapterId}
                  subjectId={subjectId}
                  handleDeleteChapter={handleDeleteChapter}
                  chapter={c}
                />
              </div>
              <div className="col-3">
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
