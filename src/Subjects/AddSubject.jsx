import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { api, apiRoutes } from "../../api.js";

export default function AddSubject() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [subjectName, setSubjectName] = useState("");
  const [order, setOrder] = useState("");

  const handleAddSubject = async (event) => {
    event.preventDefault();
    try {
      await api.post(apiRoutes.addSubject(classId), {
        subject_name: subjectName,
        order,
      });
      setSubjectName("");
      setOrder("");
      navigate(`/${classId}`);
    } catch (error) {
      console.log("error adding subject: ", error?.response?.data?.msg);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Subject Setup
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add Subject
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Pick a subject and place it in the correct order for this class.
          </p>
        </div>

        <form onSubmit={handleAddSubject} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>
            <select
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              onChange={(event) => setSubjectName(event.target.value)}
              value={subjectName}
            >
              <option value="">Select Subject</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Order
            </label>
            <input
              type="number"
              placeholder="1"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <button className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto">
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
}
