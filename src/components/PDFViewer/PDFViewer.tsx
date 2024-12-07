import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';

// Cấu hình worker với phiên bản tương thích
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js`;
const PDFViewer = ({ fileUrl }: { fileUrl: string }) => (
  <div style={{ height: '600px' }}>
    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js`}>
      <Viewer fileUrl={fileUrl} />
    </Worker>
  </div>
);

export default PDFViewer;