import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage.jsx";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./Pages/ProtectedRoute.jsx";
import AdminRoute from "./Pages/AdminRoute.jsx";
import { api } from "../api.js";
import { clearAuthSession, getStoredRole, getStoredToken, storeAuthSession } from "./auth.js";
import WelcomeModal from "./Components/WelcomeModal.jsx";
import {
  getSubjectsForClass,
  prefetchChapters,
  prefetchClasses,
} from "./data/classCache.js";

const SubjectPage = lazy(() => import("./Subjects/SubjectPage.jsx"));
const AddChapters = lazy(() => import("./Chapters/AddChapters.jsx"));
const AddSections = lazy(() => import("./Sections/AddSections.jsx"));
const EditSections = lazy(() => import("./Sections/EditSections.jsx"));
const EditChapters = lazy(() => import("./Chapters/EditChapters.jsx"));
const Auth = lazy(() => import("./Pages/Auth.jsx"));
const SingleClassPage = lazy(() => import("./Pages/SingleClassPage.jsx"));
const AddClass = lazy(() => import("./Class/AddClass.jsx"));
const AddSubject = lazy(() => import("./Subjects/AddSubject.jsx"));
const DashboardPage = lazy(() => import("./Pages/DashboardPage.jsx"));
const ContactPage = lazy(() => import("./Pages/ContactPage.jsx"));
const WELCOME_PREFERENCES_KEY = "qckRecall-welcome-preferences";

const hasCompletedWelcome = () => {
  try {
    return Boolean(localStorage.getItem(WELCOME_PREFERENCES_KEY));
  } catch {
    return false;
  }
};

function App() {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState("");
  const [currentView, setCurrentView] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasStoredSession = Boolean(getStoredToken() || getStoredRole());
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => hasStoredSession);
  const [showWelcome, setShowWelcome] = useState(() => !hasCompletedWelcome());
  const [welcomeClasses, setWelcomeClasses] = useState([]);
  const [selectedWelcomeClassId, setSelectedWelcomeClassId] = useState("");
  const [welcomeSubjects, setWelcomeSubjects] = useState([]);
  const [favoriteSubjectIds, setFavoriteSubjectIds] = useState([]);
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
    // Start both requests immediately. The class request is public and shared
    // with HomePage, so this does not create a duplicate call.
    prefetchClasses().then((loadedClasses) => {
      setWelcomeClasses(loadedClasses || []);
    });

    const bootstrapAuth = async () => {
      try {
        const res = await api.get("/api/auth/me");
        const nextRole = res?.data?.user?.roles || getStoredRole() || "";
        storeAuthSession({
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

  const handleWelcomeClassChange = (classId) => {
    setSelectedWelcomeClassId(classId);
    setFavoriteSubjectIds([]);
    setWelcomeSubjects([]);
    getSubjectsForClass(classId).then(setWelcomeSubjects).catch(() => setWelcomeSubjects([]));
  };

  const handleFavoriteSubjectToggle = (subjectId) => {
    setFavoriteSubjectIds((currentSubjectIds) => {
      const isSelected = currentSubjectIds.includes(subjectId);
      if (!isSelected) prefetchChapters(subjectId);
      return isSelected
        ? currentSubjectIds.filter((id) => id !== subjectId)
        : [...currentSubjectIds, subjectId];
    });
  };

  const handleWelcomeContinue = () => {
    try {
      localStorage.setItem(
        WELCOME_PREFERENCES_KEY,
        JSON.stringify({
          classId: selectedWelcomeClassId,
          favoriteSubjectIds,
        }),
      );
    } catch {
      // If browser storage is unavailable, the welcome flow still works.
    }
    setShowWelcome(false);
  };

  const hasValidToken = hasStoredSession;
  const fallbackPath = hasValidToken ? "/" : "/auth";

  return (
    <div className="min-h-screen w-full bg-white">
      <Navbar onHomeClick={handleBackToHome} />
      {showWelcome && (
        <WelcomeModal
          isPreparing={isCheckingAuth}
          classes={welcomeClasses}
          selectedClassId={selectedWelcomeClassId}
          subjects={welcomeSubjects}
          favoriteSubjectIds={favoriteSubjectIds}
          onClassChange={handleWelcomeClassChange}
          onFavoriteSubjectToggle={handleFavoriteSubjectToggle}
          onCancel={() => {
            setShowWelcome(false);
            navigate("/auth");
          }}
          onClose={handleWelcomeContinue}
        />
      )}
      <Suspense fallback={null}>
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
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/"
          element={<HomePage onSubjectClick={handleSubjectClick} />}
        />
        <Route
          path="/:classId"
          element={<SingleClassPage onSubjectClick={handleSubjectClick} />}
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
          path="/*"
          element={
            <ProtectedRoute
              isAuthenticated={isLoggedIn}
              isCheckingAuth={isCheckingAuth}
              loadingFallback={<HomePage />}
            >
              <Routes>
                <Route
                  path="/dashboard"
                  element={<DashboardPage userRoles={userRoles} />}
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
      </Suspense>
    </div>
  );
}

export default App;
