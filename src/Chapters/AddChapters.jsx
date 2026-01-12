import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { api } from "../../api";
import { useParams } from "react-router-dom";
import { AddChapterToList } from "./ChaptersComponents/AddChapterToList.js";
import { AddChapter } from "./ChaptersComponents/AddChapter.js";
import { ShowChaptersList } from "./ChaptersComponents/ShowChaptersList.jsx";
import { SaveChapterButton } from "./ChaptersButtons/SaveChapterButton.jsx";
import { AddChapterButton } from "./ChaptersButtons/AddChapterButton.jsx";
export default function AddChapters() {
  const navigate = useNavigate();
  const { subjectId, classId } = useParams();
  const [order, setOrder] = useState("");
  const [chaptersList, setChaptersList] = useState([]);
  // const [subjectName, setSubjectName] = useState("");
  const [chapterName, setChapterName] = useState("");
  // add chapter to list
  const handleAddChapter = () => {
    AddChapterToList(
      chapterName,
      setChaptersList,
      chaptersList,
      setChapterName
    );
    console.log("chapter added");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    AddChapter(
      classId,
      chaptersList,
      api,
      subjectId,
      setChaptersList,
      setChapterName,
      navigate,
      order
    );
    console.log("chapters submitted");
  };
  return (
    <div>
      <h1>Add Chapters</h1>
      {/* Subject Name */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />
        <input
          type="number"
          placeholder="Enter Number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="form-control"
        />
        <AddChapterButton handleAddChapter={handleAddChapter} />
        {chaptersList.map((ch, index) => (
          <div key={index} className="p-3 border rounded mb-3 bg-gray-50">
            <ShowChaptersList ch={ch} />
          </div>
        ))}
        <SaveChapterButton />
      </form>
    </div>
  );
}
