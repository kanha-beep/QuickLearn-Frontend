export default function SectionsSummary({ sectionsList, sectionContent }) {
  // console.log(" in ChapterSummary: ", sectionsList);
  return (
    <div>
      {sectionsList.length > 0 && (
        <div>
          {sectionContent && (
            <div
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: sectionContent }}
            />
          )}
        </div>
      )}
    </div>
  );
}
