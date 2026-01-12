import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage.jsx";
import SubjectPage from "./Subjects/SubjectPage.jsx";
import { Routes, Route } from "react-router-dom";
import AddChapters from "./Chapters/AddChapters.jsx";
import AddSections from "./Sections/AddSections.jsx";
import EditSections from "./Sections/EditSections.jsx";
import EditChapters from "./Chapters/EditChapters.jsx";
import ProtectedRoute from "./Pages/ProtectedRoute.jsx";
import Auth from "./Auth/Auth.jsx";
import SingleClassPage from "./Pages/SingleClassPage.jsx";
import AddClass from "./Class/AddClass.jsx";
import AddSubject from "./Subjects/AddSubject.jsx";
function App() {
  const [userRoles, setUserRoles] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setCurrentView("subject");
  };
  // console.log("current view: ", currentView);
  const handleBackToHome = () => {
    setCurrentView("/");
    setSelectedSubject(null);
  };
  return (
    <div className="" style={{ width: "98%" }}>
      <Navbar onHomeClick={handleBackToHome} />
      <Routes>
        <Route
          path="/auth"
          element={
            <Auth
              setIsLoggedIn={setIsLoggedIn}
              msg={msg}
              setMsg={setMsg}
              msgType={msgType}
              setMsgType={setMsgType}
              userRoles={userRoles}
              setUserRoles={setUserRoles}
            />
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute setUserRoles={setUserRoles}>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onSubjectClick={handleSubjectClick} />}
                />
                <Route
                  path="/add-class"
                  element={<AddClass onSubjectClick={handleSubjectClick} />}
                />
                <Route
                  path="/:classId"
                  element={
                    <SingleClassPage onSubjectClick={handleSubjectClick} />
                  }
                />
                <Route path="/:classId/add-subject" element={<AddSubject />} />
                <Route path="/:classId/:subjectId/add-chapters" element={<AddChapters />} />
                <Route path="/:classId/:subjectId/:chapterId/add-sections" element={<AddSections />} />
                <Route
                  path="/:classId/subjects/:subjectId/chapters"
                  element={<SubjectPage />}
                />
                <Route
                  path="/subjects/:subjectId/chapters/:chapterId"
                  element={<SubjectPage />}
                />
                <Route
                  path="/subjects/:subjectId/chapters/:chapterId/sections"
                  element={<SubjectPage />}
                />
                <Route
                  path="/subjects/:subjectId/chapters/:chapterId/sections/:sectionId"
                  element={<SubjectPage />}
                />

                <Route
                  path="/:classId/subjects/:subjectId/chapters/:chapterId/sections/:sectionId/edit"
                  element={<EditSections />}
                />
                <Route
                  path="/:classId/subjects/:subjectId/chapters/:chapterId/edit"
                  element={<EditChapters />}
                />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
