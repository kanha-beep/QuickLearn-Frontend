export default function SectionsSummary({ sectionsList, sectionContent }) {
  return (
    <div>
      <h3 className="">Summary</h3>
      {sectionsList.length > 0 && (
        <div className="mt-2 bg-lime-50/20">
          {sectionContent && (
            <div className="mt-3" dangerouslySetInnerHTML={{ __html: sectionContent }} />
          )}
        </div>
      )}
    </div>
  );
}
