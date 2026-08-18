"use client";
import { useState } from "react";
import Icon from "./Icon";

// Initiates the demo download from the admin-configured URL.
// `download` forces a save for same-origin files; cross-origin CDNs download via
// their own Content-Disposition (opened in a new tab so our page is never lost).
export default function DownloadDemoButton({
  url,
  title,
  className = "btn btn-ghost",
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <a
      href={url}
      download
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
      }}
      aria-label={`Download demo of ${title}`}
      className={className}
    >
      <Icon name="download" className="h-4 w-4" />
      {loading ? "Preparing download…" : "DOWNLOAD DEMO"}
    </a>
  );
}
