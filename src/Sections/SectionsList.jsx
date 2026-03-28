import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditSectionButton } from "./SectionsButtons/EditSectionButton";
import { DeleteSectionButton } from "./SectionsButtons/DeleteSectionButton";

export default function SectionsList({
  classId,
  chapterId,
  sectionsList,
  subjectId,
  handleDeleteSection,
  setSectionContent,
}) {
  const navigate = useNavigate();
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    setSectionContent(null);
    setOpenSectionId(null);
  }, [sectionsList]);

  const toggleSection = (sectionId) => {
    if (openSectionId === sectionId) {
      // Close if already open
      setOpenSectionId(null);
      setSectionContent(null);
      return;
    }

    // Open new section
    setOpenSectionId(sectionId);
    const section = sectionsList.find((s) => s._id === sectionId);
    if (section) {
      let formatted = section.section_content
        .map((s) => s.trim())
        .join("<br/><br/>");
      formatted = formatted.replace(/\d+/g, "<b>$&</b>");
      setSectionContent(formatted);
    }
  };
  return (
    <div>
      {sectionsList.length > 0 && (
        <div>
          {sectionsList.map((section) => (
            <div
              key={section._id}
              className="my-2 border rounded-4 p-2"
            >
              <div>
                <button
                  onClick={() => toggleSection(section._id)}
                  className="btn btn-link text-decoration-none text-start w-100 fs-4 fw-semibold p-0 text-dark"
                >
                  <span className="me-3 fs-5 text-secondary">{section?.order}</span>
                  <span>{section.section_name}</span>
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <div className="text-truncate">
                  <EditSectionButton
                    navigate={navigate}
                    subjectId={subjectId}
                    section={section}
                    classId={classId}
                    chapterId={chapterId}
                  />
                </div>
                <div className="text-truncate">
                  <DeleteSectionButton
                    handleDeleteSection={handleDeleteSection}
                    section={section}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
