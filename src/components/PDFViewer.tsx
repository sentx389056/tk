"use client";

import { useState, useEffect, useRef } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { waitForPolyfills } from '@/lib/polyfill-utils';

// Determine worker source based on browser compatibility
const determineWorkerSrc = () => {
  if (typeof window !== 'undefined') {
    // Check if Promise.withResolvers is supported
    if (typeof Promise.withResolvers === 'undefined') {
      return '/pdf.worker.legacy.min.js';
    }
  }
  return '/pdf.worker.min.js';
};

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = determineWorkerSrc();
}

interface PDFViewerProps {
  fileUrl: string;
  title: string;
}

export default function PDFViewer({ fileUrl, title }: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [renderedPages, setRenderedPages] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setRenderedPages(0);
    setTotalPages(0);

    try {
      // Wait for polyfills to load before proceeding
      await waitForPolyfills();
      const response = await fetch(fileUrl.replace('/api/files/', '/api/pdf-view/'));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const loadingTask = getDocument(blobUrl);
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
    if (!pdfBlobUrl || totalPages === 0) return;

    const renderAllPages = async () => {
      try {
        const loadingTask = getDocument(pdfBlobUrl);
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
  }, [pdfBlobUrl, totalPages]);

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

        // Clear canvas before rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Add white background to ensure visibility
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;

        // Verify that canvas has content (not just white)
        const imageData = context.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
        const hasContent = imageData.data.some((value, index) => {
          // Check alpha channel (every 4th value) and RGB values
          return index % 4 === 3 ? value < 255 : value !== 255;
        });

        if (!hasContent) {
          console.warn(`Page ${pageNum} appears to be empty after rendering`);
          // Try alternative rendering method
          await renderPageAlternative(page, canvas, context, viewport);
        }

        return; // Success

      } catch (error) {
        console.warn(`Attempt ${attempt} failed for page ${pageNum}:`, error);

        if (attempt === maxRetries) {
          // Try fallback rendering method
          try {
            await renderPageFallback(pdf, pageNum);
            return; // Success with fallback
          } catch (fallbackError) {
            console.error(`Fallback also failed for page ${pageNum}:`, fallbackError);
            throw error; // Re-throw original error
          }
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  };

  // Alternative rendering method for empty pages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageAlternative = async (page: any, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, viewport: any): Promise<void> => {
    console.log(`Trying alternative render for page`);

    try {
      // Method 1: Different scale
      const altViewport = page.getViewport({ scale: 2.0 });
      canvas.height = altViewport.height;
      canvas.width = altViewport.width;

      await page.render({
        canvasContext: context,
        viewport: altViewport,
        intent: 'print'
      }).promise;

    } catch (error) {
      console.warn(`Alternative render failed, trying text extraction`);

      // Method 2: Text extraction and rendering
      try {
        const textContent = await page.getTextContent();
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'black';
        context.font = '14px Arial';

        let y = 30;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim()) {
            context.fillText(item.str, 20, y);
            y += 20;
            if (y > canvas.height - 30) {
              y = 30;
            }
          }
        });

      } catch (textError) {
        console.warn(`Text extraction failed, creating placeholder`);

        // Method 3: Placeholder with page info
        context.fillStyle = '#f8f8f8';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#ddd';
        context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        context.fillStyle = '#666';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText('Содержимое страницы не найдено', canvas.width / 2, canvas.height / 2 - 20);

        context.font = '16px Arial';
        context.fillText('Попробуйте обновить страницу', canvas.width / 2, canvas.height / 2 + 10);
      }
    }
  };

  // Fallback rendering method with lower quality but higher compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageFallback = async (pdf: any, pageNum: number): Promise<void> => {
    const page = await pdf.getPage(pageNum);

    const canvas = canvasRefs.current[pageNum - 1];
    if (!canvas) {
      throw new Error(`Canvas not available for page ${pageNum} in fallback`);
    }

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(`Could not get canvas context for page ${pageNum} in fallback`);
    }

    // Use lower scale for fallback
    const viewport = page.getViewport({ scale: 1.0 });

    // Set canvas dimensions
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Try different rendering options
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      intent: 'display' // Use display intent instead of print
    };

    // Add timeout to prevent hanging
    const renderPromise = page.render(renderContext).promise;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Render timeout')), 10000)
    );

    await Promise.race([renderPromise, timeoutPromise]);
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
        className="text-start"
        style={{ backgroundColor: 'transparent', color: '#1f2937', padding: '8px 12px'}}
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
                style={{ color: '#6b7280', backgroundColor: 'transparent', padding: '4px 8px' }}
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
}
