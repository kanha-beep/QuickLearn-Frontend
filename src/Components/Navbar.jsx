import { GraduationCap } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const roles = localStorage.getItem("roles");
  const isLoggedIn = !!token && token !== "undefined" && token !== "null";
  const isAdmin = roles === "admin";
  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const isHomePage = pathname === "/";
  const isSingleClassPage =
    pathParts.length === 1 &&
    !["auth", "dashboard", "add-class"].includes(pathParts[0]);
  const isSubjectPage =
    pathname.includes("/chapters") &&
    !pathname.includes("/add-chapters") &&
    !pathname.includes("/add-sections") &&
    !pathname.endsWith("/edit");
  const searchEnabled = isHomePage || isSingleClassPage || isSubjectPage;
  const searchPlaceholder = isHomePage
    ? "Search classes"
    : isSingleClassPage
      ? "Search subjects"
      : isSubjectPage
        ? "Search chapters"
        : "";
  const searchValue = searchParams.get("q") || "";

  const handleSearchChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-black backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-start">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 text-black bg-white px-3 py-2 text-sm font-semibold shadow-sm transition hover:border-blue-500 hover:text-blue-600"
          >
            <GraduationCap className="h-5 w-5" />
            <span>FSSA</span>
          </button>
          <span className="mt-1 text-xs font-medium text-white">
            Your Learning Companion
          </span>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-none md:justify-end">
          {searchEnabled && (
            <div className="w-full md:w-[9.5rem] md:flex-none">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="form-control form-control-sm text-xs"
              />
            </div>
          )}
          {isLoggedIn && isAdmin && (
            <button
              className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 sm:px-4"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          )}
          {!isLoggedIn ? (
            <button
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:px-4"
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
          ) : (
            <button
              className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 sm:px-4"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("tokens");
                localStorage.removeItem("user");
                localStorage.removeItem("roles");
                navigate("/auth");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
