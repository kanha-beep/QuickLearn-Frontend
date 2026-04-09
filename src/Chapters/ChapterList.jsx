import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AddSectionButton } from "../Sections/SectionsButtons/AddSectionButton.jsx";
import { EditSingleChapterButton } from "./ChaptersButtons/EditSingleChapterButton.jsx";
import { DeleteChapterButton } from "./ChaptersButtons/DeleteChapterButton.jsx";
import ChapterNameButton from "./ChaptersButtons/ChapterNameButton.jsx";

export default function ChapterList({
  handleSections,
  chaptersList,
  subjectId,
  classId,
  subjectName,
  onChapterSelect,
}) {
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("roles");
  const storedUser = localStorage.getItem("user");
  const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  const isAdmin = storedRole === "admin" || userRole === "admin";

  useEffect(() => {
    setChapters(chaptersList || []);
  }, [chaptersList]);

  return (
    <div className="rounded">
      <div className="d-flex">
        {chapters.map((c) => (
          <div key={c._id} className="rounded my-2 d-flex">
            <div className="col-3">
              <ChapterNameButton
                c={c}
                handleSections={handleSections}
                onChapterSelect={onChapterSelect}
              />
            </div>
            <div
              className="row rounded d-flex justify-content-end"
              style={{ width: "20rem" }}
            >
              {isAdmin && (
                <div className="col-2">
                  <EditSingleChapterButton
                    navigate={navigate}
                    subjectId={subjectId}
                    classId={classId}
                    chapter={c}
                  />
                </div>
              )}
              {isAdmin && (
                <div className="col-2">
                  <DeleteChapterButton chapter={c} subjectId={subjectId} />
                </div>
              )}
              {isAdmin && (
                <div className="col-2">
                  <AddSectionButton
                    navigate={navigate}
                    c={c}
                    classId={classId}
                    subjectId={subjectId}
                    subjectName={subjectName}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
