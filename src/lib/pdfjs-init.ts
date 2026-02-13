// src/lib/pdfjs-init.ts
import * as pdfjsLib from 'pdfjs-dist';

// Устанавливаем workerSrc ОДИН РАЗ и ДО первого использования
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export { pdfjsLib };
