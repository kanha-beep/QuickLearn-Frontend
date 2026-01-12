// import { OpenSubjectButton } from "../Pages/OpenSubjectButton.jsx";
export default function ClassHomeCard({ subject, navigate }) {
  return (
    <div className="py-2">
      <div className="card border rounded shadow">
        <div className="card-body text-center">
          <h1 className="card-title">{subject?.class_name}</h1>
          <div className="card-text">{subject?._id}</div>
        </div>
        <div className="card-footer">
          <button
            className="btn btn-outline-success"
            onClick={() => navigate(`/${subject._id}`, { state: subject?._id })}
          >
            Open Subjects →
          </button>
          {/* <OpenSubjectButton navigate={navigate} cl={subject} /> */}
        </div>
      </div>
    </div>
  );
}
