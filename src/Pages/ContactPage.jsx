import { useMemo, useState } from "react";
import { api } from "../../api.js";
import { getStoredUser } from "../auth.js";

const defaultForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const storedUser = useMemo(() => getStoredUser(), []);
  const [formData, setFormData] = useState({
    ...defaultForm,
    email: storedUser?.email || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await api.post("/api/contact/complaints", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setFeedback({
        type: "success",
        message: response?.data?.msg || "Complaint submitted successfully.",
      });
      setFormData({
        ...defaultForm,
        email: storedUser?.email || "",
      });
    } catch (error) {
      setFeedback({
        type: "danger",
        message:
          error?.response?.data?.msg ||
          error?.message ||
          "Failed to submit your complaint.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Support
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Contact
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Share the issue you are facing and it will be sent directly to the admin.
          </p>
        </div>

        {feedback.message ? (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Short issue title"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Complaint
            </label>
            <textarea
              rows="8"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Send..." : "Send Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
