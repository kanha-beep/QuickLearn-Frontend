import { useState } from "react";
import { api } from "../../api.js";

const toSectionPayload = (section, order) => ({
  sectionName: section.sectionName,
  sectionContent: "",
  order,
  subsections: (section.subsections || []).map((subsection, index) => ({
    subsection_name: subsection.subsectionName,
    subsection_content: subsection.subsectionContent,
    order: subsection.order || index + 1,
  })),
});

export default function PdfBotImport({ subjectId, chapterId, firstOrder, onSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const extract = async () => {
    if (!file) {
      setMessage("Choose a PDF first.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const form = new FormData();
      form.append("pdf", file);
      const response = await api.post(
        `/api/subjects/${subjectId}/chapters/${chapterId}/pdf-bot/extract`,
        form,
      );
      setPreview(response.data.sections || []);
      setMessage("Review the source headings below. Nothing has been saved yet.");
    } catch (error) {
      setMessage(error.response?.data?.detail || error.response?.data?.msg || "Could not read this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!preview?.length) return;

    setBusy(true);
    setMessage("");
    try {
      for (const [index, section] of preview.entries()) {
        await api.post(
          `/api/subjects/${subjectId}/chapters/${chapterId}/sections/add-section`,
          toSectionPayload(section, firstOrder + index),
        );
      }
      setPreview(null);
      setFile(null);
      setMessage("All extracted sections were saved to this chapter.");
      onSaved?.();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Some sections could not be saved. Check the chapter before trying again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mb-6 rounded-[2rem] border border-amber-200 bg-amber-50 p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-950">Offline PDF Bot</span>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Import a chapter from PDF</h2>
          <p className="mt-1 text-sm text-slate-600">It keeps detected PDF headings as subsection names. It does not use an external API or save before you confirm.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <button type="button" className="btn btn-warning" onClick={extract} disabled={busy}>
          {busy ? "Reading PDF..." : "Preview PDF Structure"}
        </button>
      </div>

      {message && <p className="mt-3 text-sm font-medium text-slate-700">{message}</p>}

      {preview?.length > 0 && (
        <div className="mt-5">
          <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
            {preview.map((section) => (
              <article key={section.order} className="rounded-2xl border border-amber-200 bg-white p-3">
                <p className="text-sm font-bold text-amber-800">{section.sectionName}</p>
                {section.subsections.map((subsection) => (
                  <div key={subsection.subsectionName} className="mt-2">
                    <h3 className="font-semibold text-slate-900">{subsection.subsectionName}</h3>
                    <ol className="mt-1 list-inside list-decimal text-sm text-slate-600">
                      {subsection.subsectionContent.map((line, index) => (
                        <li key={`${index}-${line}`}>{line.replace(/^\d+\.\s*/, "")}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </article>
            ))}
          </div>
          <button type="button" className="btn btn-success mt-4" onClick={save} disabled={busy}>
            {busy ? "Saving..." : "Save This Structure to Chapter"}
          </button>
        </div>
      )}
    </section>
  );
}
