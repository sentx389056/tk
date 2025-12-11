"use client";

import { useState, useEffect, useRef } from "react";

const PDFViewerApplications = ({ fileUrl, title }: { fileUrl: string; title: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [pdfjs, setPdfjs] = useState<unknown>(null);

  const isPdfJsLib = (obj: unknown): obj is {
    getDocument: (src: string | Uint8Array) => {
      promise: Promise<{
        numPages: number;
        getPage: (pageNum: number) => Promise<{
          getViewport: (params: { scale: number }) => { width: number; height: number };
          render: (params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
        }>;
      }>;
    };
    GlobalWorkerOptions: { workerSrc: string };
  } => {
    return obj !== null && typeof obj === 'object' && 'getDocument' in obj && 'GlobalWorkerOptions' in obj;
  };

  useEffect(() => {
    const loadPdfjs = async () => {
      if (typeof window !== 'undefined') {
        const pdfjsLib = await import('pdfjs-dist');

        // Determine worker source based on browser compatibility
        const workerSrc = typeof Promise.withResolvers === 'undefined'
          ? '/pdf.worker.legacy.min.js'
          : '/pdf.worker.min.js';

        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        setPdfjs(pdfjsLib);
      }
    };
    loadPdfjs();
  }, []);

  const handleOpen = async () => {
    if (!isPdfJsLib(pdfjs)) return;

    setIsOpen(true);
    setLoading(true);
    setError(null);
    setRenderedPages(0);
    setTotalPages(0);

    try {
      const response = await fetch(fileUrl.replace('/api/files/', '/api/pdf-view/'));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const loadingTask = pdfjs.getDocument(blobUrl);
      const pdf = await loadingTask.promise;

      setTotalPages(pdf.numPages);
      setPdfBlobUrl(blobUrl);
    } catch (err) {
      setError(`Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfBlobUrl || totalPages === 0 || !isPdfJsLib(pdfjs)) return;

    const renderAllPages = async () => {
      try {
        const loadingTask = pdfjs.getDocument(pdfBlobUrl);
        const pdf = await loadingTask.promise;

        // Ensure canvas refs array is properly sized
        if (canvasRefs.current.length < pdf.numPages) {
          canvasRefs.current = Array(pdf.numPages).fill(null);
        }

        // Render pages with better error handling and retry logic
        const renderPromises = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const renderPromise = renderPageWithRetry(pdf, pageNum, 3);
          renderPromises.push(renderPromise);
        }

        // Wait for all pages to render (or fail)
        const results = await Promise.allSettled(renderPromises);

        // Count successfully rendered pages
        const successfulPages = results.filter(result =>
          result.status === 'fulfilled'
        ).length;

        setRenderedPages(successfulPages);

        if (successfulPages < pdf.numPages) {
          console.warn(`Only ${successfulPages} of ${pdf.numPages} pages rendered successfully`);
        }

      } catch (err) {
        console.error('PDF rendering error:', err);
        setError(`Ошибка рендеринга: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      }
    };

    renderAllPages();
  }, [pdfBlobUrl, totalPages, pdfjs]);

  // Helper function to render a single page with retry logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageWithRetry = async (pdf: any, pageNum: number, maxRetries: number): Promise<void> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const page = await pdf.getPage(pageNum);

        // Wait a bit for canvas ref to be available
        let canvas = canvasRefs.current[pageNum - 1];
        let attempts = 0;
        while (!canvas && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          canvas = canvasRefs.current[pageNum - 1];
          attempts++;
        }

        if (!canvas) {
          throw new Error(`Canvas not available for page ${pageNum}`);
        }

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error(`Could not get canvas context for page ${pageNum}`);
        }

        const viewport = page.getViewport({ scale: 1.5 });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        return; // Success

      } catch (error) {
        console.warn(`Attempt ${attempt} failed for page ${pageNum}:`, error);

        if (attempt === maxRetries) {
          throw error; // Re-throw after final attempt
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }

    setPdfBlobUrl(null);
    setRenderedPages(0);
    setTotalPages(0);
    canvasRefs.current = [];
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full text-start bg-gray-800 text-white cursor-pointer p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-200 font-medium text-lg"
        style={{ backgroundColor: '#1f2937', color: 'white', border: '1px solid #374151' }}
      >
        {title}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onContextMenu={preventContextMenu}
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-t-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold truncate">{title}</h3>
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
                <div className="flex items-center justify-center h-full">
                  <div className="text-red-600">{error}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {totalPages > 0 && (
                    <div className="text-center text-sm text-gray-600 mb-4">
                      Отображено страниц: {renderedPages} из {totalPages}
                    </div>
                  )}

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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFViewerApplications;
