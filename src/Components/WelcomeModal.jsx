import { useEffect, useState } from "react";

export default function WelcomeModal({
  isPreparing,
  classes,
  selectedClassId,
  subjects,
  favoriteSubjectIds,
  onClassChange,
  onFavoriteSubjectToggle,
  onCancel,
  onClose,
}) {
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCanDismiss(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
        <h1 id="welcome-title" className="text-2xl font-bold text-slate-900">
          Welcome to qckRecall
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Get ready to learn faster.
        </p>
        <p className="mt-5 text-sm font-medium text-slate-500" aria-live="polite">
          {isPreparing ? "Preparing your study space…" : "Your study space is ready."}
        </p>
        <div className="mt-5 text-left">
          <label htmlFor="welcome-class" className="mb-2 block text-sm font-semibold text-slate-700">
            Your class
          </label>
          <select
            id="welcome-class"
            value={selectedClassId}
            onChange={(event) => onClassChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select your class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.class_name}
              </option>
            ))}
          </select>
        </div>
        {selectedClassId && (
          <div className="mt-4 text-left">
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Favorite subjects <span className="font-normal text-slate-500">(choose any)</span>
            </p>
            <div className="max-h-32 space-y-2 overflow-y-auto rounded-xl border border-slate-100 p-3">
              {subjects.length > 0 ? subjects.map((subject) => (
                <label key={subject._id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={favoriteSubjectIds.includes(subject._id)}
                    onChange={() => onFavoriteSubjectToggle(subject._id)}
                  />
                  <span>{subject.subject_name}</span>
                </label>
              )) : (
                <p className="text-sm text-slate-500">Loading subjects…</p>
              )}
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={!canDismiss}
            className="btn btn-outline-secondary w-full rounded-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={!canDismiss}
            className="btn btn-primary w-full rounded-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {canDismiss ? "Continue" : "Just a moment…"}
          </button>
        </div>
      </div>
    </div>
  );
}
