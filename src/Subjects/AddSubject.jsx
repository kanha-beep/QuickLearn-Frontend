import { useLocation, useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { api } from "../../api";

export default function AddClass() {
  const { classId } = useParams();
  console.log("classId: ", classId);
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [order, setOrder] = useState("");
  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/subjects/${classId}/add-subjects`, {
        subjectName,
        order,
      });
      console.log("added class: ", res?.data);
      return navigate(`/${classId}`);
    } catch (error) {
      console.log("error adding class: ", error?.response?.data?.msg);
      return navigate(`/${classId}`);
    }
  };
  console.log("subjectName: ", subjectName);
  return (
    <div>
      <h1>Add Class</h1>
      <form onSubmit={handleAddSubject}>
        {/* Subject Name */}
        <select
          className="w-full border p-3 rounded mb-6"
          onChange={(e) => setSubjectName(e.target.value)}
          value={subjectName}
        >
          <option value="">Select Subject</option>
          <option value="english">English</option>
          <option value="hindi">hindi</option>
          <option value="mathematics">Mathematics</option>
          <option value="physics">Physics</option>
          <option value="chemistry">Chemistry</option>
          <option value="biology">Biology</option>
          <option value="history">History</option>
          <option value="geography">Geography</option>
          <option value="polity">Polity</option>
          <option value="economy">Economics</option>
          <option value="arts">Arts</option>
          <option value="music">Music</option>
        </select>
        <input
          type="number"
          placeholder="Enter Number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-secondary my-2">
          Add Subject
        </button>
      </form>
    </div>
  );
}
