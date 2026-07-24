import SafeRichContent, { hasSafeRenderableContent } from "../Components/SafeRichContent.jsx";

export default function SectionsSummary({ sectionsList, sectionContent }) {
  return (
    <div>
      <h3 className="">Summary</h3>
      {sectionsList.length > 0 ? (
        <div className="mt-2 bg-lime-50/20">
          {hasSafeRenderableContent(sectionContent) ? (
            <SafeRichContent content={sectionContent} className="mt-3 text-sm text-slate-700" />
          ) : (
            <p className="mt-3 text-sm text-slate-500">Coming soon</p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Coming soon</p>
      )}
    </div>
  );
}
