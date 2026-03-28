import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api, apiRoutes } from "../../api.js";

export default function AddClass() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState("");
  const [order, setOrder] = useState("");

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      await api.post(apiRoutes.addClass, { classes, order });
      setClasses("");
      setOrder("");
      return navigate("/");
    } catch (error) {
      console.log("error adding class: ", error?.response?.data?.msg);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Admin Setup
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Add Class
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a new class and assign its display order.
          </p>
        </div>

        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Class Name
            </label>
            <input
              type="text"
              placeholder="For example: Class 10"
              value={classes}
              onChange={(e) => setClasses(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Order
            </label>
            <input
              type="number"
              placeholder="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
}
