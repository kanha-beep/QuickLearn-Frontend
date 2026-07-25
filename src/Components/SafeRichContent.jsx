const getContentItems = (content = []) => {
  if (Array.isArray(content)) {
    return content.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(content || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getYoutubeEmbedUrl = (value = "") => {
  const trimmed = String(value).trim();

  const shortMatch = trimmed.match(
    /^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/i,
  );
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})(?:[&#?].*)?$/i,
  );
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const embedMatch = trimmed.match(
    /^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/([a-zA-Z0-9_-]{11})(?:\?.*)?$/i,
  );
  if (embedMatch) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  return "";
};

const getVideoUrl = (value = "") => {
  const trimmed = String(value).trim();
  const urlMatch = trimmed.match(/^https?:\/\/\S+\.(?:mp4|webm|ogg)(?:\?.*)?$/i);
  return urlMatch ? urlMatch[0] : "";
};

const splitLeadingNumber = (value = "") => {
  const trimmed = String(value).trim();
  const match = trimmed.match(/^(\d+\.)(\s*)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    number: match[1],
    text: match[3],
  };
};

export function hasSafeRenderableContent(content = []) {
  return getContentItems(content).length > 0;
}

export default function SafeRichContent({ content = [], className = "" }) {
  const items = getContentItems(content);

  if (!items.length) {
    return null;
  }

  return (
    <div className={className}>
      {items.map((item, index) => {
        const youtubeEmbedUrl = getYoutubeEmbedUrl(item);
        if (youtubeEmbedUrl) {
          return (
            <div key={`${youtubeEmbedUrl}-${index}`} className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
              <iframe
                className="aspect-video w-full"
                src={youtubeEmbedUrl}
                title={`Embedded lesson ${index + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          );
        }

        const videoUrl = getVideoUrl(item);
        if (videoUrl) {
          return (
            <video
              key={`${videoUrl}-${index}`}
              className="my-3 w-full rounded-2xl border border-slate-200 bg-black"
              controls
              preload="metadata"
            >
              <source src={videoUrl} />
            </video>
          );
        }

        const numberedItem = splitLeadingNumber(item);

        return (
          <p
            key={`${item.slice(0, 32)}-${index}`}
            className="mb-3 last:mb-0 text-[1rem] font-normal leading-7 text-slate-700"
          >
            {numberedItem ? (
              <>
                <span className="mr-3 inline-block min-w-[2.25rem] font-medium text-slate-900">
                  {numberedItem.number}
                </span>
                <span>{numberedItem.text}</span>
              </>
            ) : (
              item
            )}
          </p>
        );
      })}
    </div>
  );
}
