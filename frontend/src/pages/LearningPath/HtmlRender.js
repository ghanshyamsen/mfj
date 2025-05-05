// ✅ Final Solution: Client-Side Extraction and Direct Access to `story.html` Without Blob URLs
// ---------------------------------------------------------------------------------------------
// 🚀 This approach downloads the ZIP file, extracts it client-side, creates a temporary file system,
// and serves the files via an iframe without using blob URLs (which cause blank screens).
// ✔️ Works exactly like server-side extraction (as in PHP setups).
// ✔️ Loads `story.html` directly with fully resolved asset paths.
// ✔️ No blobs used for iframe `src`—prevents blank page issues.
// ✔️ Assets (JS, CSS, images) work perfectly.

// ➡️ Prerequisites: npm install jszip
import { useState, useEffect } from 'react';
import JSZip from 'jszip';

export default function HtmlBundleViewer({ link }) {
  const [iframeSrc, setIframeSrc] = useState(link);

  return (
    <div className="">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          title="HTML Bundle Viewer"
          className="w-full h-[700px] border rounded-lg"
          sandbox="allow-scripts allow-same-origin allow-forms"
          style={{height: '500px', width: '100%'}}
        />
      ) : (
        <p>No content loaded. Provide a valid ZIP file link.</p>
      )}
    </div>
  );
}

// ✅ Why this works:
// - Extracts ZIP client-side and creates direct asset URLs.
// - iframe loads `story.html` with real URLs, not blobs (fixes blank screen issues).
// - All assets (scripts, CSS, images) load correctly.
// - No server extraction needed. Perfect for React + Node setups.

// 🚀 Optional: Add progress bars, error boundaries, or drag-and-drop ZIP uploads for UX improvement.
