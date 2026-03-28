export function OpenChapterButton({ navigate, subject, classId }) {
  return (
    <button
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
      onClick={() =>
        navigate(`/${classId}/subjects/${subject._id}/chapters`, {
          state: {
            subjectId: subject?._id,
            subjectName: subject?.subject_name,
            classId,
          },
        })
      }
    >
      Open Chapters
    </button>
  );
}
