import { useState } from "react";
import { api, apiRoutes } from "../../api";
import { useNavigate } from "react-router-dom";

function AuthView() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;
      const endpoint = isLogin ? apiRoutes.authLogin : apiRoutes.authRegister;
      const res = await api.post(endpoint, payload);

      if (res?.data?.user) localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res?.data?.token) localStorage.setItem("token", res.data.token);
      if (res?.data?.roles) localStorage.setItem("roles", res.data.roles);

      navigate("/");
    } catch (error) {
      alert(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3 py-4">
      <div className="card border-0 shadow-sm rounded-4" style={{ width: "100%", maxWidth: "430px" }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <p className="text-uppercase text-secondary small mb-2">QuickLearn</p>
            <h2 className="fw-bold mb-2">{isLogin ? "Login" : "Register"}</h2>
            <p className="text-muted mb-0">Continue to your study workspace.</p>
          </div>

          <div className="d-flex mb-4 bg-light rounded-3 p-1">
            <button
              type="button"
              className={`btn flex-fill rounded-3 ${isLogin ? "btn-dark" : "btn-light"}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`btn flex-fill rounded-3 ${!isLogin ? "btn-dark" : "btn-light"}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="d-grid gap-3">
            {!isLogin && (
              <div>
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthView;
