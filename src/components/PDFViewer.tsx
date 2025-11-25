"use client";

import { useState, useEffect, useRef } from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Настраиваем worker для PDF.js через public folder
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
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
      console.log('Загрузка PDF:', fileUrl);
      const response = await fetch(fileUrl.replace('/api/files/', '/api/pdf-view/'));
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('PDF загружен, размер:', blob.size, 'bytes');
      
      // Создаем Blob URL для PDF
      const blobUrl = URL.createObjectURL(blob);
      console.log('Blob URL создан:', blobUrl);
      
      // Загружаем PDF через PDF.js для получения числа страниц
      const loadingTask = getDocument(blobUrl);
      const pdf = await loadingTask.promise;
      console.log('PDF загружен, страниц:', pdf.numPages);
      
      setTotalPages(pdf.numPages);
      setPdfBlobUrl(blobUrl);
    } catch (err) {
      console.error('Ошибка загрузки PDF:', err);
      setError(`Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  // Рендеринг всех страниц PDF после того как canvas появятся в DOM
  useEffect(() => {
    if (!pdfBlobUrl || totalPages === 0) return;

    const renderAllPages = async () => {
      try {
        console.log('Начало рендеринга всех страниц PDF');
        
        // Загружаем PDF через PDF.js используя Blob URL
        const loadingTask = getDocument(pdfBlobUrl);
        const pdf = await loadingTask.promise;
        console.log('PDF загружен, страниц:', pdf.numPages);
        
        // Инициализируем массив canvas refs если нужно
        if (canvasRefs.current.length < pdf.numPages) {
          canvasRefs.current = Array(pdf.numPages).fill(null);
        }
        
        // Рендерим каждую страницу
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          console.log(`Рендеринг страницы ${pageNum}`);
          
          const page = await pdf.getPage(pageNum);
          
          const canvas = canvasRefs.current[pageNum - 1];
          if (!canvas) {
            console.error(`Canvas для страницы ${pageNum} не найден`);
            continue;
          }

          const context = canvas.getContext('2d');
          if (!context) {
            console.error(`2D контекст для страницы ${pageNum} не получен`);
            continue;
          }

          const viewport = page.getViewport({ scale: 1.5 });
          console.log(`Viewport страницы ${pageNum}:`, viewport.width, 'x', viewport.height);
          
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          };

          await page.render(renderContext).promise;
          console.log(`Страница ${pageNum} отрендерена`);
          
          setRenderedPages(pageNum);
        }
        
        console.log('Все страницы отрендерены');
      } catch (err) {
        console.error('Ошибка рендеринга PDF:', err);
        setError(`Ошибка рендеринга: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      }
    };

    renderAllPages();
  }, [pdfBlobUrl, totalPages]);

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    
    // Очищаем Blob URL чтобы избежать утечек памяти
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
