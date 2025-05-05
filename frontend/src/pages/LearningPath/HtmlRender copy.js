import { useState, useEffect } from 'react';
import JSZip from 'jszip';

export default function HtmlBundleFromLink({link}) {
  const [iframeSrc, setIframeSrc] = useState(null);
  const [zipUrl, setZipUrl] = useState(link);

  const handleLoadBundle = async () => {
    if (!zipUrl) return alert('Please enter a valid ZIP file URL.');

    try {
      const response = await fetch(zipUrl);
      if (!response.ok) throw new Error('Failed to fetch ZIP file.');

      const zipData = await response.blob();
      const zip = await JSZip.loadAsync(zipData);
      const files = {};

      // Extract files into a virtual file system
      await Promise.all(
        Object.keys(zip.files).map(async (fileName) => {
          if (!zip.files[fileName].dir) {
            files[fileName] = await zip.files[fileName].async('blob');
          }
        })
      );

      // Find the main HTML file (e.g., index.html)
      const indexFile = Object.keys(files).find((name) => name.endsWith('story.html'));
      if (!indexFile) return alert('No index.html found in the ZIP.');

      const indexHtmlBlob = files[indexFile];
      const reader = new FileReader();

      reader.onload = (event) => {
        let htmlContent = event.target.result;

        // Replace asset paths with Blob URLs
        Object.entries(files).forEach(([fileName, blob]) => {
          const blobUrl = URL.createObjectURL(blob);
          const cleanPath = fileName.replace(/^\.\//, '');
          htmlContent = htmlContent.replace(new RegExp(cleanPath, 'g'), blobUrl);
        });

        const finalBlob = new Blob([htmlContent], { type: 'text/html' });
        setIframeSrc(URL.createObjectURL(finalBlob));
      };

      reader.readAsText(indexHtmlBlob);
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading ZIP file. Please check the URL.');
    }
  };

  useEffect(() => {

    handleLoadBundle();

  },[]);

  return (
    <div className="p-4 space-y-4">
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          title="HTML Bundle Viewer"
          className="w-full h-[1000px] border rounded-lg"
          style={{height: '300px', width: '100%'}}
        />
      )}
    </div>
  );
}
