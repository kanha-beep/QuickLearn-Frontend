import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditSectionButton } from "./SectionsButtons/EditSectionButton";
import { DeleteSectionButton } from "./SectionsButtons/DeleteSectionButton";
import { useSections } from "../hooks";

export default function SectionsList({
  handleDeleteSection,
  subjectId,
  chapterId,
  sectionsList,
  setSectionContent,
  openSectionId,
  setOpenSectionId,
  classId,
}) {
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("roles");
  const storedUser = localStorage.getItem("user");
  const userRole = storedUser ? JSON.parse(storedUser)?.roles : "";
  const isAdmin = storedRole === "admin" || userRole === "admin";

  useEffect(() => {
    setSectionContent(null);
    setOpenSectionId(null);
  }, [sectionsList, setSectionContent, setOpenSectionId]);

  const toggleSection = (sectionId) => {
    if (openSectionId === sectionId) {
      setOpenSectionId(null);
      setSectionContent(null);
      return;
    }

    setOpenSectionId(sectionId);
    const section = sectionsList.find((s) => s._id === sectionId);
    if (section) {
      let formatted = section.section_content.map((s) => s.trim()).join("<br/><br/>");
      formatted = formatted.replace(/\d+/g, "<b>$&</b>");
      setSectionContent(formatted);
    }
  };

  const allSections = useSections(subjectId, chapterId);

  return (
    <div>
      <h3 className="mb-3">Sections</h3>
      {allSections.length > 0 && (
        <div>
          {allSections.map((section) => (
            <div key={section._id} className="my-2 d-flex justify-content-between me-2">
              <div>
                <span className="me-2">{section?.order}</span>
                <button
                  onClick={() => toggleSection(section._id)}
                  className={`btn ${
                    openSectionId === section._id ? "btn-primary" : "btn-outline-primary"
                  } text-start`}
                >
                  <span>{section.section_name}</span>
                </button>
              </div>
              {isAdmin && (
                <div className="d-flex">
                  <div className="text-truncate">
                    <EditSectionButton
                      navigate={navigate}
                      section={section}
                      subjectId={subjectId}
                      classId={classId}
                    />
                  </div>
                  <div className="text-truncate">
                    <DeleteSectionButton
                      handleDeleteSection={handleDeleteSection}
                      section={section}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
