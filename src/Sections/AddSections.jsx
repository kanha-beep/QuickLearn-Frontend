import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { api } from "../../api.js";
import { handleChange } from "../Components/HandleChange.js";
import { AddSection } from "./SectionsComponents/AddSection.js";
import { useEffect } from "react";
export default function AddSections() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapterId, subjectId, classId } = useParams();

  const whatToAdd = location.state?.addButton || "";
  const [sections, setSections] = useState({
    sectionName: "",
    sectionContent: "",
    order: "",
  });
  console.log(
    "chapterId",
    chapterId,
    "chapterName",
    location.state?.chapterName,
    "subjectName",
    location.state?.subjectName,
    "subject id",
    subjectId
  );
  const [addView, setAddView] = useState("");
  useEffect(() => {
    if (whatToAdd === "sections") {
      setAddView("sections");
    } else if (whatToAdd === "meanings") {
      setAddView("meanings");
    }
  }, [addView]);

  const handleAddSections = async (e) => {
    console.log("section adding started from page: ", sections);
    AddSection(
      e,
      sections,
      api,
      subjectId,
      chapterId,
      setSections,
      navigate,
      classId
    );
    console.log("section added ended on section add page");
  };
  return (
    <div>
      <h1>Add Sections</h1>
      <p>Chapter Name: {location?.state?.chapterName}</p>
      <p>Chapter Id: {chapterId}</p>
      <p>Subject Id: {subjectId}</p>
      <form onSubmit={handleAddSections}>
        <input
          type="number"
          name="order"
          placeholder="Order"
          value={sections.order}
          onChange={(e) => handleChange(e, setSections)}
          className="form-control"
        />
        <input
          placeholder={
            addView === "sections" ? "Enter Section Name" : "Enter Word Name"
          }
          value={sections.sectionName}
          name="sectionName"
          onChange={(e) => handleChange(e, setSections)}
          className="form-control my-1"
        />
        <textarea
          rows="30"
          cols="30"
          placeholder={
            addView === "sections"
              ? "Enter Section Content"
              : "Enter Word Meaning"
          }
          name="sectionContent"
          onChange={(e) => handleChange(e, setSections)}
          value={sections.sectionContent}
          className="form-control my-1"
        />
        <button type="submit" className="btn btn-primary">
          Add Section
        </button>
      </form>
      <button
        className="btn btn-outline-secondary"
        onClick={() => navigate(`/subjects/${subjectId}/chapters`)}
      >
        Go back to Subject page
      </button>
      <div>
        <p>Section Name: {sections.sectionName}</p>
        <p>Section Content: {sections.sectionContent}</p>
      </div>
    </div>
  );
}
// setSections((prev) => {
//   const updated = [...prev];
//   updated[0] = {
//     ...updated[0],
//     [name]: value,
//     chapterId: chapterId,
//   };
//   return updated;
// });
