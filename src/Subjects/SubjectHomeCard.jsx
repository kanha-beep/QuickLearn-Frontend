import * as LucideIcons from "lucide-react";
import { SubjectName } from "./SubjectsComponents/SubjectName.jsx";
import { SubjectDescription } from "./SubjectsComponents/SubjectDescription.jsx";
import { OpenSubjectButton } from "../Pages/OpenSubjectButton.jsx";
import { OpenChapterButton } from "../Pages/OpenChapterButton.jsx";

export default function SubjectHomeCard({ subject, navigate,classId }) {
  return (
    <div>
      <div className="py-2">
        <div className="card border rounded">
          <div className="card-body text-center">
            <h1 className="card-title">{subject?.subject_name.toUpperCase()}</h1>
            {/* <div className="card-text">{subject?._id}</div> */}
          </div>
          <div className="card-footer">
            <OpenChapterButton navigate={navigate} subject={subject} classId={classId} />
          </div>
        </div>
      </div>
    </div>
  );
}
