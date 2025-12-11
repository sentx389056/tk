"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Determine worker source based on browser compatibility
const determineWorkerSrc = () => {
  if (typeof window !== 'undefined') {
    if (typeof Promise.withResolvers === 'undefined') {
      return '/pdf.worker.legacy.min.js';
    }
  }
  return '/pdf.worker.min.js';
};

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = determineWorkerSrc();
}

interface PDFEnhancedViewerProps {
  fileUrl: string;
  title: string;
}

interface PageRenderInfo {
  pageNum: number;
  status: 'pending' | 'loading' | 'success' | 'error' | 'empty';
  error?: string;
  renderTime?: number;
}

export default function PDFEnhancedViewer({ fileUrl, title }: PDFEnhancedViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageStatuses, setPageStatuses] = useState<PageRenderInfo[]>([]);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const updatePageStatus = useCallback((pageNum: number, status: PageRenderInfo['status'], error?: string, renderTime?: number) => {
    setPageStatuses(prev => {
      const newStatuses = [...prev];
      const existingIndex = newStatuses.findIndex(s => s.pageNum === pageNum);
      const info: PageRenderInfo = { pageNum, status, error, renderTime };

      if (existingIndex >= 0) {
        newStatuses[existingIndex] = info;
      } else {
        newStatuses.push(info);
      }
      return newStatuses;
    });
  }, []);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setPdfBlobUrl(null);
    setTotalPages(0);
    setPageStatuses([]);

    try {
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

      // Initialize page statuses
      const initialStatuses: PageRenderInfo[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        initialStatuses.push({ pageNum: i, status: 'pending' });
      }
      setPageStatuses(initialStatuses);

    } catch (err) {
      setError(`Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderPageWithMultipleMethods = async (pdf: any, pageNum: number): Promise<void> => {
    updatePageStatus(pageNum, 'loading');
    const startTime = Date.now();

    try {
      // Method 1: Standard rendering
      await tryStandardRender(pdf, pageNum);
      updatePageStatus(pageNum, 'success', undefined, Date.now() - startTime);
      return;
    } catch (error1) {
      console.warn(`Standard render failed for page ${pageNum}:`, error1);

      try {
        // Method 2: Lower quality render
        await tryLowQualityRender(pdf, pageNum);
        updatePageStatus(pageNum, 'success', undefined, Date.now() - startTime);
        return;
      } catch (error2) {
        console.warn(`Low quality render failed for page ${pageNum}:`, error2);

        try {
          // Method 3: Text-only render
          await tryTextRender(pdf, pageNum);
          updatePageStatus(pageNum, 'success', undefined, Date.now() - startTime);
          return;
        } catch (error3) {
          console.warn(`Text render failed for page ${pageNum}:`, error3);

          // Method 4: Placeholder with page number
          await tryPlaceholderRender(pageNum);
          updatePageStatus(pageNum, 'empty', 'All render methods failed', Date.now() - startTime);
        }
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tryStandardRender = async (pdf: any, pageNum: number): Promise<void> => {
    const page = await pdf.getPage(pageNum);
    const canvas = await getCanvas(pageNum);
    const context = canvas.getContext('2d')!;

    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tryLowQualityRender = async (pdf: any, pageNum: number): Promise<void> => {
    const page = await pdf.getPage(pageNum);
    const canvas = await getCanvas(pageNum);
    const context = canvas.getContext('2d')!;

    const viewport = page.getViewport({ scale: 0.8 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      intent: 'display'
    }).promise;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tryTextRender = async (pdf: any, pageNum: number): Promise<void> => {
    const page = await pdf.getPage(pageNum);
    const canvas = await getCanvas(pageNum);
    const context = canvas.getContext('2d')!;

    const viewport = page.getViewport({ scale: 1.2 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Try to get text content and render it
    try {
      const textContent = await page.getTextContent();
      context.fillStyle = 'black';
      context.font = '12px Arial';

      let y = 20;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      textContent.items.forEach((item: any) => {
        if (item.str) {
          context.fillText(item.str, 20, y);
          y += 15;
        }
      });
    } catch (textError) {
      throw new Error('Text rendering failed');
    }
  };

  const tryPlaceholderRender = async (pageNum: number): Promise<void> => {
    const canvas = await getCanvas(pageNum);
    const context = canvas.getContext('2d')!;

    canvas.width = 400;
    canvas.height = 600;

    // Create placeholder
    context.fillStyle = '#f5f5f5';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#ddd';
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    context.fillStyle = '#666';
    context.font = '24px Arial';
    context.textAlign = 'center';
    context.fillText(`Страница ${pageNum}`, canvas.width / 2, canvas.height / 2);

    context.font = '14px Arial';
    context.fillText('Не удалось отобразить содержимое', canvas.width / 2, canvas.height / 2 + 30);
  };

  const getCanvas = async (pageNum: number): Promise<HTMLCanvasElement> => {
    let canvas = canvasRefs.current[pageNum - 1];
    let attempts = 0;

    while (!canvas && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      canvas = canvasRefs.current[pageNum - 1];
      attempts++;
    }

    if (!canvas) {
      throw new Error(`Canvas not available for page ${pageNum}`);
    }

    return canvas;
  };

  useEffect(() => {
    if (!pdfBlobUrl || totalPages === 0) return;

    const renderAllPages = async () => {
      try {
        const loadingTask = getDocument(pdfBlobUrl);
        const pdf = await loadingTask.promise;

        // Ensure canvas refs array
        if (canvasRefs.current.length < pdf.numPages) {
          canvasRefs.current = Array(pdf.numPages).fill(null);
        }

        // Render pages with small delays to prevent overwhelming
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          await renderPageWithMultipleMethods(pdf, pageNum);
          // Small delay between pages
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (err) {
        console.error('PDF rendering error:', err);
        setError(`Ошибка рендеринга: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      }
    };

    renderAllPages();
  }, [pdfBlobUrl, totalPages]);

  const handleClose = () => {
    setIsOpen(false);
    setError(null);

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
    }

    setPdfBlobUrl(null);
    setTotalPages(0);
    setPageStatuses([]);
    canvasRefs.current = [];
  };

  const getStatusColor = (status: PageRenderInfo['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-600';
      case 'loading': return 'bg-blue-100 text-blue-600';
      case 'success': return 'bg-green-100 text-green-600';
      case 'error': return 'bg-red-100 text-red-600';
      case 'empty': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: PageRenderInfo['status']) => {
    switch (status) {
      case 'pending': return 'Ожидание';
      case 'loading': return 'Загрузка';
      case 'success': return 'Успешно';
      case 'error': return 'Ошибка';
      case 'empty': return 'Пустая страница';
      default: return 'Неизвестно';
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-start border-2 border-green-500 p-2 rounded hover:bg-green-50"
        style={{ backgroundColor: '#1f2937', color: 'white', border: '2px solid #22c55e' }}
      >
        {title} (Enhanced)
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
          <div className="bg-white rounded-t-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold truncate">{title} (Enhanced Mode)</h3>
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
                <div className="text-red-600 text-center p-8">
                  <div className="text-xl font-semibold mb-2">Ошибка загрузки</div>
                  <div>{error}</div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="mb-4 p-3 bg-white rounded shadow-sm">
                      <h4 className="font-semibold mb-2">Статус страниц:</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {pageStatuses.map((status) => (
                          <div
                            key={status.pageNum}
                            className={`text-xs p-2 rounded text-center ${getStatusColor(status.status)}`}
                          >
                            <div className="font-semibold">Стр. {status.pageNum}</div>
                            <div>{getStatusText(status.status)}</div>
                            {status.renderTime && (
                              <div className="text-xs">{status.renderTime}мс</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <div key={index} className="relative flex justify-center">
                          <canvas
                            ref={(el) => {
                              canvasRefs.current[index] = el;
                            }}
                            className="border border-gray-300 shadow-lg bg-white"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            Страница {index + 1}
                          </div>
                        </div>
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
