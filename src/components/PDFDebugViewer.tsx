"use client";

import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';

// Determine worker source based on browser compatibility
const determineWorkerSrc = () => {
  if (typeof window !== 'undefined') {
    // Check if Promise.withResolvers is supported
    if (typeof Promise.withResolvers === 'undefined') {
      return '/pdf.worker.js';
    }
  }
  return '/pdf.worker.min.mjs';
};

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = determineWorkerSrc();
}

interface PDFDebugViewerProps {
  fileUrl: string;
  title: string;
}

export default function PDFDebugViewer({ fileUrl, title }: PDFDebugViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const addDebugInfo = (info: string) => {
    console.log('[PDF Debug]', info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setRenderedPages(0);
    setTotalPages(0);
    setDebugInfo([]);

    addDebugInfo(`Opening document: ${title}`);
    addDebugInfo(`File URL: ${fileUrl}`);

    try {
      const response = await fetch(fileUrl.replace('/api/files/', '/api/pdf-view/'));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      addDebugInfo(`Blob created, size: ${blob.size} bytes, type: ${blob.type}`);

      const blobUrl = URL.createObjectURL(blob);
      addDebugInfo(`Blob URL created: ${blobUrl.substring(0, 50)}...`);

      const loadingTask = pdfjsLib.getDocument(blobUrl);
      addDebugInfo(`PDF loading task created`);

      // Add progress listener
      loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
        const percentage = progress.total > 0 ? Math.round(progress.loaded / progress.total * 100) : 0;
        addDebugInfo(`Loading progress: ${progress.loaded}/${progress.total} (${percentage}%)`);
      };

      const pdf = await loadingTask.promise;
      addDebugInfo(`PDF loaded successfully, pages: ${pdf.numPages}`);

      setTotalPages(pdf.numPages);
      setPdfBlobUrl(blobUrl);
    } catch (err) {
      const errorMsg = `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`;
      addDebugInfo(`ERROR: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfBlobUrl || totalPages === 0) return;

    const renderAllPages = async () => {
      addDebugInfo(`Starting render of ${totalPages} pages`);

      try {
        const loadingTask = pdfjsLib.getDocument(pdfBlobUrl);
        const pdf = await loadingTask.promise;

        // Ensure canvas refs array is properly sized
        if (canvasRefs.current.length < pdf.numPages) {
          canvasRefs.current = Array(pdf.numPages).fill(null);
          addDebugInfo(`Canvas refs array resized to ${pdf.numPages}`);
        }

        // Render pages sequentially for debugging
        let successfulPages = 0;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          addDebugInfo(`Attempting to render page ${pageNum}`);

          try {
            await renderPageWithDebug(pdf, pageNum);
            successfulPages++;
            addDebugInfo(`Page ${pageNum} rendered successfully`);
          } catch (pageError) {
            addDebugInfo(`ERROR rendering page ${pageNum}: ${pageError}`);
            console.error(`Page ${pageNum} error:`, pageError);
          }

          // Small delay between pages to avoid overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        setRenderedPages(successfulPages);
        addDebugInfo(`Rendering complete: ${successfulPages}/${pdf.numPages} pages successful`);

      } catch (err) {
        const errorMsg = `Ошибка рендеринга: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`;
        addDebugInfo(`RENDER ERROR: ${errorMsg}`);
        console.error('PDF rendering error:', err);
        setError(errorMsg);
      }
    };

    renderAllPages();
  }, [pdfBlobUrl, totalPages]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageWithDebug = async (pdf: any, pageNum: number): Promise<void> => {
    addDebugInfo(`Getting page ${pageNum}`);
    const page = await pdf.getPage(pageNum);

    // Wait for canvas ref to be available
    let canvas = canvasRefs.current[pageNum - 1];
    let attempts = 0;
    while (!canvas && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 50));
      canvas = canvasRefs.current[pageNum - 1];
      attempts++;
    }

    if (!canvas) {
      throw new Error(`Canvas not available for page ${pageNum} after ${attempts} attempts`);
    }
    addDebugInfo(`Canvas found for page ${pageNum}`);

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`Could not get canvas context for page ${pageNum}`);
    }
    addDebugInfo(`Canvas context obtained for page ${pageNum}`);

    const viewport = page.getViewport({ scale: 1.5 });
    addDebugInfo(`Viewport calculated: ${viewport.width}x${viewport.height}`);

    // Clear canvas before rendering
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    addDebugInfo(`Canvas dimensions set: ${canvas.width}x${canvas.height}`);

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    addDebugInfo(`Starting render for page ${pageNum}`);
    await page.render(renderContext).promise;
    addDebugInfo(`Render completed for page ${pageNum}`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      addDebugInfo(`Blob URL revoked`);
    }

    setPdfBlobUrl(null);
    setRenderedPages(0);
    setTotalPages(0);
    canvasRefs.current = [];
    setDebugInfo([]);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-start border-2 border-red-500 p-2 rounded"
        style={{ backgroundColor: '#1f2937', color: 'white', border: '2px solid #ef4444' }}
      >
        {title} (DEBUG)
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <div className="bg-white rounded-t-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold truncate">{title} (DEBUG MODE)</h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                style={{ color: '#6b7280', backgroundColor: 'transparent', border: '1px solid #d1d5db', padding: '4px 8px', borderRadius: '4px' }}
              >
                ×
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto bg-gray-100 rounded-b-lg">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-600">Загрузка документа...</div>
                </div>
              ) : error ? (
                <div className="flex flex-col h-full">
                  <div className="text-red-600 mb-4">{error}</div>
                  <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
                    <div className="font-bold mb-2">Debug Log:</div>
                    {debugInfo.map((info, index) => (
                      <div key={index} className="mb-1">{info}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Отображено страниц: {renderedPages} из {totalPages}
                    </div>

                    <div className="space-y-4">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <div key={index} className="relative flex justify-center">
                          <canvas
                            ref={(el) => {
                              canvasRefs.current[index] = el;
                            }}
                            className="border border-gray-300 shadow-lg"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            Страница {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-80">
                    <div className="bg-black text-green-400 p-4 rounded font-mono text-xs overflow-auto max-h-96">
                      <div className="font-bold mb-2 sticky top-0 bg-black">Debug Log:</div>
                      {debugInfo.map((info, index) => (
                        <div key={index} className="mb-1">{info}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
