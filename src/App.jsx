import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage.jsx";
import SubjectPage from "./Subjects/SubjectPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import AddChapters from "./Chapters/AddChapters.jsx";
import AddSections from "./Sections/AddSections.jsx";
import EditSections from "./Sections/EditSections.jsx";
import EditChapters from "./Chapters/EditChapters.jsx";
import ProtectedRoute from "./Pages/ProtectedRoute.jsx";
import AdminRoute from "./Pages/AdminRoute.jsx";
import Auth from "./Pages/Auth.jsx";
import SingleClassPage from "./Pages/SingleClassPage.jsx";
import AddClass from "./Class/AddClass.jsx";
import AddSubject from "./Subjects/AddSubject.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import { api } from "../api.js";
import { clearAuthSession, getStoredRole, getStoredToken, storeAuthSession } from "./auth.js";
function App() {
  const [userRoles, setUserRoles] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        setIsCheckingAuth(false);
        setIsLoggedIn(false);
        setUserRoles("");
        return;
      }

      try {
        const res = await api.get("/api/auth/me");
        const nextRole = res?.data?.user?.roles || getStoredRole();
        storeAuthSession({
          token,
          user: res?.data?.user,
          roles: nextRole,
        });
        setUserRoles(nextRole);
        setIsLoggedIn(true);
      } catch (error) {
        clearAuthSession();
        setUserRoles("");
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    bootstrapAuth();
  }, []);

  const hasValidToken = Boolean(getStoredToken());
  const fallbackPath = hasValidToken ? "/" : "/auth";

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
            <ProtectedRoute
              isAuthenticated={isLoggedIn}
              isCheckingAuth={isCheckingAuth}
            >
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onSubjectClick={handleSubjectClick} />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <DashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/add-class"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <AddClass onSubjectClick={handleSubjectClick} />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/:classId"
                  element={
                    <SingleClassPage onSubjectClick={handleSubjectClick} />
                  }
                />
                <Route
                  path="/:classId/add-subject"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <AddSubject />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/:classId/:subjectId/add-chapters"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <AddChapters />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/:classId/:subjectId/:chapterId/add-sections"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <AddSections />
                    </AdminRoute>
                  }
                />
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
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <EditSections />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/:classId/subjects/:subjectId/chapters/:chapterId/edit"
                  element={
                    <AdminRoute
                      isAuthenticated={isLoggedIn}
                      isCheckingAuth={isCheckingAuth}
                      userRoles={userRoles}
                    >
                      <EditChapters />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={fallbackPath} replace />} />
      </Routes>
    </div>
  );
}

export default App;
