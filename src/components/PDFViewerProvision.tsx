"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';

const PDFViewerProvision = ({ fileUrl }: { fileUrl: string }) => {
  const [loading, setLoading] = useState(true);
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
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        setPdfjs(pdfjsLib);
      }
    };
    loadPdfjs();
  }, []);

  useEffect(() => {
    const loadPdf = async () => {
      if (!isPdfJsLib(pdfjs)) return;
      
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

    loadPdf();
  }, [fileUrl, pdfjs]);

  useEffect(() => {
    if (!pdfBlobUrl || totalPages === 0 || !isPdfJsLib(pdfjs)) return;

    const renderAllPages = async () => {
      try {
        
        const loadingTask = pdfjs.getDocument(pdfBlobUrl);
        const pdf = await loadingTask.promise;
        
        if (canvasRefs.current && canvasRefs.current.length < pdf.numPages) {
          canvasRefs.current = Array(pdf.numPages).fill(null);
        }
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          
          const page = await pdf.getPage(pageNum);
          
          const canvas = canvasRefs.current?.[pageNum - 1];
          if (!canvas) {
            continue;
          }

          const context = canvas.getContext('2d');
          if (!context) {
            continue;
          }

          const viewport = page.getViewport({ scale: 1.5 });
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          };

          await page.render(renderContext).promise;
          
          setRenderedPages(pageNum);
        }
        
      } catch (err) {
        setError(`Ошибка рендеринга: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      }
    };

    renderAllPages();

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl, totalPages, pdfjs]);

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-lg bg-gray-50 p-4 overflow-auto max-h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Загрузка документа...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
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
                    if (canvasRefs.current) {
                      canvasRefs.current[index] = el; 
                    }
                  }}
                  className="border border-gray-300 shadow-lg bg-white"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onContextMenu={preventContextMenu}
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
  );
};

export default PDFViewerProvision;
