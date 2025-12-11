"use client";

import { useState } from "react";
import PDFViewer from "@/components/PDFViewer";
import PDFDebugViewer from "@/components/PDFDebugViewer";

export default function PDFTestPage() {
  const [useDebug, setUseDebug] = useState(false);

  // Test PDF URLs - replace with actual URLs from your application
  const testPdfs = [
    { title: "Test Document 1", url: "/api/files/test1.pdf" },
    { title: "Test Document 2", url: "/api/files/test2.pdf" },
    { title: "Test Document 3", url: "/api/files/test3.pdf" },
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">PDF Rendering Test Page</h1>
        
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useDebug}
              onChange={(e) => setUseDebug(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Use Debug Mode (shows detailed logs and sequential rendering)</span>
          </label>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click on document titles to test rendering</li>
            <li>Debug mode shows detailed rendering logs</li>
            <li>Check browser console for additional error messages</li>
            <li>Try different PDFs to isolate document-specific issues</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Documents:</h2>
        {testPdfs.map((pdf, index) => (
          <div key={index} className="p-4 border rounded">
            {useDebug ? (
              <PDFDebugViewer fileUrl={pdf.url} title={pdf.title} />
            ) : (
              <PDFViewer fileUrl={pdf.url} title={pdf.title} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h2 className="font-semibold mb-2">Troubleshooting Tips:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>If some pages don't render, try debug mode to see detailed logs</li>
          <li>Check if the issue is specific to certain PDF files</li>
          <li>Try different browsers to isolate browser-specific issues</li>
          <li>Large PDFs may need more time to render</li>
          <li>Network issues can prevent PDF loading</li>
        </ul>
      </div>
    </div>
  );
}
