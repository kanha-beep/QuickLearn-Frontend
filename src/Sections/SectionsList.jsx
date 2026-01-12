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
    <div className="border rounded">
      <h3 className="mb-3">Sections</h3>
      {sectionsList.length > 0 && (
        <div className="border rounded">
          {/* <ul className=""> */}
          {sectionsList.map((section) => (
            <div
              key={section._id}
              className="my-2 d-flex justify-content-between me-2"
            >
              <div className="">
                <span className="me-2">{section?.order}</span>
                <button
                  onClick={() => toggleSection(section._id)}
                  className={`btn ${
                    openSectionId === section._id
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } text-start`}
                >
                  <span className="">{section.section_name}</span>
                </button>
              </div>
              <div className="d-flex">
                <div className="text-truncate">
                  <EditSectionButton
                    navigate={navigate}
                    subjectId={subjectId}
                    section={section}
                    classId={classId}
                    chapterId={chapterId}
                  />
                </div>
                <div className=" text-truncate">
                  <DeleteSectionButton
                    handleDeleteSection={handleDeleteSection}
                    section={section}
                  />
                </div>
              </div>
            </div>
          ))}
          {/* </ul> */}
        </div>
      )}
    </div>
  );
}
