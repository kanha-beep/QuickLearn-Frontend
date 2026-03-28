import { GraduationCap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const isLoggedIn = !!localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin =
    localStorage.getItem("roles") === "admin" || parsedUser?.roles === "admin";

  const searchConfig = useMemo(() => {
    const pathname = location.pathname;

    if (pathname === "/") {
      return { show: true, placeholder: "Search classes" };
    }

    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length === 1) {
      return { show: true, placeholder: "Search subjects" };
    }

    if (pathname.includes("/subjects/") || pathname.includes("/chapters")) {
      return { show: true, placeholder: "Search chapters" };
    }

    return { show: false, placeholder: "Search" };
  }, [location.pathname]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set("q", value);
    else nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
        >
          <GraduationCap className="h-6 w-6 text-slate-900" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-slate-900">FSSA</span>
            <span className="text-xs text-slate-500">Your Learning Companion</span>
          </div>
        </button>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {searchConfig.show && (
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder={searchConfig.placeholder}
              className="form-control form-control-sm w-full rounded-xl border-slate-300 text-xs shadow-sm lg:w-[9.5rem]"
            />
          )}

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn btn-outline-secondary btn-sm"
              >
                Dashboard
              </button>
            )}

            {!isLoggedIn ? (
              <button
                onClick={() => navigate("/auth")}
                className="btn btn-outline-dark btn-sm"
              >
                Login
              </button>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline-dark btn-sm">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
