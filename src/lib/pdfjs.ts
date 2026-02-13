// lib/pdfjs.ts
import * as pdfjsLib from 'pdfjs-dist';

// Устанавливаем workerSrc ДО того, как кто-либо использует pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default pdfjsLib;
