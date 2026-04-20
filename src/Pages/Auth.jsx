import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api.js";
import { WrapAsync } from "../Utils/WrapAsync.js";
import { storeAuthSession } from "../auth.js";

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
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUserAuth = WrapAsync(
    async () => {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await api.post(isLogin ? "/api/auth/login" : "/api/auth/register", {
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name.trim(),
      });
      const role = res?.data?.roles || res?.data?.user?.roles || "";
      storeAuthSession({
        token: res?.data?.token,
        user: res?.data?.user,
        roles: role,
      });
      setUserRoles(role);
      setIsLoggedIn(true);
      navigate("/");
      return res;
    },
    setMsg,
    setMsgType,
  );

  const handleOwnerAuth = WrapAsync(
    async () => {
      if (!isLogin) {
        throw new Error("Owner registration is not available");
      }

      return handleUserAuth();
    },
    setMsg,
    setMsgType,
  );

  const submitAuth = async (e) => {
    e.preventDefault();

    try {
      if (role === "owner") {
        await handleOwnerAuth();
      } else {
        await handleUserAuth();
      }
    } catch (error) {
      setMsg(error?.response?.data?.msg || error?.message || "Authentication failed");
      setMsgType("danger");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center bg-gradient px-3 py-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-sm-5">
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

                <div className="d-flex flex-column flex-sm-row mb-4 gap-1 rounded-3 bg-light p-1">
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

                <form onSubmit={submitAuth}>
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
