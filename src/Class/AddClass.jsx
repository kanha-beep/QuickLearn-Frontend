import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { api } from "../../api";

export default function AddClass() {
  const { classId } = useParams();
  console.log("classId: ", classId);
  const navigate = useNavigate();
  const [classes, setClasses] = useState("");
  const [order, setOrder] = useState("")
  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/class/add-class`, { classes , order});
      console.log("added class: ", res?.data);
      setClasses("");
      return navigate("/");
    } catch (error) {
      console.log("error adding class: ", error?.response?.data?.msg);
    }
  };
  return (
    <div>
      <h1>Add Class</h1>
      <form onSubmit={handleAddClass}>
        <input
          type="text"
          placeholder="Class Name"
          value={classes}
          onChange={(e) => setClasses(e.target.value)}
          className="form-control"
        />
        <input
          type="number"
          placeholder="Enter Number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="form-control"
        />
        <button type="submit" className="btn btn-secondary my-2">
          Add Class
        </button>
      </form>
    </div>
  );
}
