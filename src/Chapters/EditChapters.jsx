import { useLocation } from "react-router-dom";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";

export default function EditChapters() {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState();
  const { subjectId, chapterId, classId } = useParams();
  const chapterN = useLocation().state?.chapterN;
  console.log("EditSections props: ", chapterN);
  const [chapterName, setChapterName] = React.useState(chapterN);
  const handleChapterDataUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(
        `/subjects/${subjectId}/chapters/${chapterId}/edit`,
        {
          chapterName,
          order,
        }
      );
      console.log("chapter updated successfully: ", res?.data);
      return navigate(`/${classId}/subjects/${subjectId}/chapters`);
    } catch (err) {
      console.error("Error updating section: ", err?.response?.data);
    }
  };
  console.log("chapterName: ", chapterName);
  return (
    <div>
      <h1>Edit Chapter</h1>
      <form onSubmit={handleChapterDataUpdate}>
        <input
          placeholder="Chapter Name"
          name="chapterName"
          value={chapterName}
          className="form-control my-2"
          onChange={(e) => setChapterName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-outline-success">Save</button>
      </form>
    </div>
  );
}
