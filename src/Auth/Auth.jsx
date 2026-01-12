import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api.js";
import { WrapAsync } from "../Utils/WrapAsync.js";
export default function Auth({
  userRoles,
  setUserRoles,
  setIsLoggedIn,
  msg,
  setMsg,
  msgType,
  setMsgType,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const location = useLocation();
  const role = location?.state;
  console.log("role: ", role);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleUserAuth = WrapAsync(
    async () => {
      if (isLogin) {
        console.log("login starts from frontend");
        const res = await api.post("/auth/login", formData);
        console.log("user logged in: ", res?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("roles", res?.data?.roles);
        setUserRoles(res?.data?.roles);
        setIsLoggedIn(true);
        navigate("/");
        return res;
      } else {
        const res = await api.post("/auth/register", formData);
        console.log("user registered in: ", res?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
        localStorage.setItem("token", res?.data?.token);
        setIsLoggedIn(true);
        navigate("/");
        return res;
      }
    },
    setMsg,
    setMsgType
  );
  const handleOwnerAuth = async () => {
    if (isLogin) {
      try {
        const res = await api.post("/auth/owner/login", formData);
        console.log("user logged in: ", res?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
        localStorage.setItem("token", res?.data?.token);
        setIsLoggedIn(true);
        navigate("/all-slots");
      } catch (e) {
        console.log("error in login: ", e?.response?.data?.message);
        setIsLogin(false);
      }
    } else {
      try {
        const res = await api.post("/auth/owner/register", formData);
        console.log("user registered in: ", res?.data);
        localStorage.setItem("user", JSON.stringify(res?.data?.user));
        localStorage.setItem("token", res?.data?.token);
        setIsLoggedIn(true);
        navigate("/all-slots");
      } catch (e) {
        console.log("error in login: ", e?.response?.data?.message);
        setIsLogin(true);
      }
    }
  };
  return (
    <div
      className="min-vh-100 d-flex align-items-center bg-gradient"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fas fa-plane text-primary fs-1 mb-3"></i>
                  <h2 className="fw-bold text-dark mb-2">Study App</h2>
                  <p className="text-muted">
                    {role === "owner" ? "Owner Portal" : "User Portal"}
                  </p>
                </div>

                {msg && typeof msg === "string" && msg.trim() !== "" && (
                  <div
                    className={`alert ${
                      msgType === "success" ? "alert-success" : "alert-danger"
                    } alert-dismissible fade show`}
                    role="alert"
                  >
                    <i
                      className={`fas ${
                        msgType === "success"
                          ? "fa-check-circle"
                          : "fa-exclamation-triangle"
                      } me-2`}
                    ></i>
                    {msg}
                  </div>
                )}

                <div className="d-flex mb-4 bg-light rounded-3 p-1">
                  <button
                    type="button"
                    className={`btn flex-fill ${
                      isLogin ? "btn-primary" : "btn-light"
                    } rounded-3`}
                    onClick={() => setIsLogin(true)}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill ${
                      !isLogin ? "btn-primary" : "btn-light"
                    } rounded-3`}
                    onClick={() => setIsLogin(false)}
                  >
                    <i className="fas fa-user-plus me-2"></i>Register
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (role === "owner") handleOwnerAuth();
                    else handleUserAuth();
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-lock me-2"></i>Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg rounded-3"
                          placeholder="Confirm your password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          <i className="fas fa-user me-2"></i>Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                  >
                    <i
                      className={`fas ${
                        isLogin ? "fa-sign-in-alt" : "fa-user-plus"
                      } me-2`}
                    ></i>
                    {isLogin ? "Login" : "Register"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin
                        ? "Don't have an account? Create one"
                        : "Already have an account? Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
