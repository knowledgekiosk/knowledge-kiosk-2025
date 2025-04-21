import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { IoIosArrowBack } from "react-icons/io";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export function PdfViewer() {
  const pdfData = useLoaderData();
  const navigate = useNavigate();
  const [numPages, setNumPages] = React.useState(null);

  function onDocumentLoadSuccess(pdf) {
    setNumPages(pdf._pdfInfo.numPages);
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-700 select-none">
      {/* Fixed Back Button */}
      <button
        onClick={handleGoBack}
        className="fixed bottom-8 left-32 z-50 flex items-center gap-2 bg-white text-blue-500 border-2 border-blue-500 px-3 py-2 rounded-full shadow-lg"
      >
        <IoIosArrowBack size={20} />
        <span className="font-medium">Go Back</span>
      </button>

      {/* Scrollable PDF container */}
      <div className="absolute inset-0 pt-4 pb-8 overflow-y-auto flex flex-col items-center space-y-6">
        {/* Outer border wrapper */}
        <div className="w-[90%] max-w-4xl border-2 border-gray-600 bg-white shadow-lg p-4 rounded">
          <Document
            file={pdfData.fullUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-center text-white mt-4">Loading PDF...</div>}
            error={<div className="text-center text-red-500 mt-4">Failed to load PDF</div>}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div key={i} className="mb-4">
                <Page pageNumber={i + 1} width={Math.min(window.innerWidth * 0.85, 800)} />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}
