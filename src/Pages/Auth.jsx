import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleUserAuth = WrapAsync(
    async () => {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const res = await api.post(
        isLogin ? "/api/auth/login" : "/api/auth/register",
        {
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          name: formData.name.trim(),
        },
      );
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
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (role === "owner") {
        await handleOwnerAuth();
      } else {
        await handleUserAuth();
      }
    } catch (error) {
      setMsg(
        error?.response?.data?.msg || error?.message || "Authentication failed",
      );
      setMsgType("danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[44rem] items-center px-3 py-4 justify-center">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <div className="rounded-[2rem] bg-white shadow-2xl transition-transform duration-300">
              <div className="pt-2 px-4 sm:p-5">
                <div className="mb-4 text-center">
                  <i className="fas fa-plane mb-3 text-5xl text-blue-600"></i>
                  <h2 className="mb-2 text-3xl font-bold text-slate-900">
                    qckRecall
                  </h2>
                  {/* <p className="text-slate-500">
                    {role === "owner" ? "Owner Portal" : "User Portal"}
                  </p> */}
                </div>

                {msg && typeof msg === "string" && msg.trim() !== "" && (
                  <div
                    className={`mb-4 rounded-2xl border px-4 py-3 text-sm shadow-sm transition-all duration-200 ${
                      msgType === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                    role="alert"
                  >
                    <div className="flex items-start gap-2">
                      <i
                        className={`fas mt-0.5 ${
                          msgType === "success"
                            ? "fa-check-circle"
                            : "fa-exclamation-triangle"
                        }`}
                      ></i>
                      <span>{msg}</span>
                    </div>
                  </div>
                )}

                <div className="mb-4 flex flex-col gap-1 rounded-2xl bg-slate-100 p-1 sm:flex-row">
                  <button
                    type="button"
                    className={`btn flex-fill ${
                      isLogin ? "btn-primary" : "btn-light"
                    } rounded-3 transition-all duration-200`}
                    onClick={() => setIsLogin(true)}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </button>
                  <button
                    type="button"
                    className={`btn flex-fill ${
                      !isLogin ? "btn-primary" : "btn-light"
                    } rounded-3 transition-all duration-200`}
                    onClick={() => setIsLogin(false)}
                  >
                    <i className="fas fa-user-plus mr-2"></i>Register
                  </button>
                </div>

                <form onSubmit={submitAuth}>
                  <div className="mb-3">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      <i className="fas fa-envelope mr-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      <i className="fas fa-lock mr-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          <i className="fas fa-lock mr-2"></i>Confirm Password
                        </label>
                        <input
                          type="password"
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          placeholder="Confirm your password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          <i className="fas fa-user mr-2"></i>Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
                    disabled={isSubmitting}
                    className="btn btn-primary mb-3 w-full rounded-3 transition-all duration-200"
                  >
                    <i
                      className={`fas ${
                        isLogin ? "fa-sign-in-alt" : "fa-user-plus"
                      } mr-2`}
                    ></i>
                    {isSubmitting
                      ? isLogin
                        ? "Login..."
                        : "Register..."
                      : isLogin
                        ? "Login"
                        : "Register"}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link no-underline"
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
