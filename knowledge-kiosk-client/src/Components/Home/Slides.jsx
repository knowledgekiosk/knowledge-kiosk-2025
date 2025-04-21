import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { HiPause } from "react-icons/hi2";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Setup PDF.js worker
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).href;
} catch {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).href;
}

// Hook to get viewport dimensions
const useWindow = () => {
  const get = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(get);
  useEffect(() => {
    const onResize = () => setSize(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
};

export const Slides = () => {
  const pdfs = useLoaderData();      
  const { revalidate } = useRevalidator();
  const { w, h } = useWindow();

  // double‐buffer state
  const [idx, setIdx] = useState(0);
  const [pause, setPause] = useState(false);
  const [sec, setSec] = useState(20);
  const [fileA, setFileA] = useState("");
  const [fileB, setFileB] = useState("");
  const [frontIsA, setFrontIsA] = useState(true);

  // helper to resolve file URL
  const fileAt = useCallback(
    (i) => (typeof pdfs[i] === "string" ? pdfs[i] : pdfs[i]?.pdfUrl ?? ""),
    [pdfs]
  );

  // Initialize and reset buffers when pdfs change
  useEffect(() => {
    if (!pdfs || pdfs.length === 0) return;
    setIdx(0);
    setFrontIsA(true);
    setSec(20);
    const first = fileAt(0);
    const second = fileAt(pdfs.length > 1 ? 1 : 0);
    setFileA(first);
    setFileB(second);
  }, [pdfs, fileAt]);

  // Unified step function with correct double‐buffering
  const step = useCallback(
    (dir) => {
      if (!pdfs || pdfs.length < 2) return;
      const newIdx     = (idx + dir + pdfs.length) % pdfs.length;
      const preloadIdx = (newIdx + dir + pdfs.length) % pdfs.length;

      if (frontIsA) {
        setFileB(fileAt(newIdx));
        setFileA(fileAt(preloadIdx));
      } else {
        setFileA(fileAt(newIdx));
        setFileB(fileAt(preloadIdx));
      }

      setIdx(newIdx);
      setFrontIsA(!frontIsA);
      setSec(20);
    },
    [idx, pdfs, frontIsA, fileAt]
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  // Auto‑advance timer
  useEffect(() => {
    if (pause || !pdfs || pdfs.length < 2) return;
    const t = setTimeout(next, 20_000);
    return () => clearTimeout(t);
  }, [idx, pause, pdfs, next]);

  // Countdown tick
  useEffect(() => {
    if (pause || !pdfs || pdfs.length < 2) return;
    const i = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(i);
  }, [pause, pdfs]);

  // Render
  if (!pdfs || pdfs.length === 0) {
    return <p className="text-white">No PDFs available</p>;
  }

  // Progress ring calculations
  const R = 28;
  const C = 2 * Math.PI * R;
  const offset = C - ((20 - sec) / 20) * C;

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden select-none">
      {/* Buffer A */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          frontIsA ? "opacity-100" : "opacity-0"
        }`}
      >
        {fileA && (
          <Document
            key={fileA}
            file={fileA}
            onLoadError={(e) => console.error("PDF load error:", e)}
            loading={null}
            noData={null}
          >
            <Page pageNumber={1} renderMode="canvas" width={w} height={h} />
          </Document>
        )}
      </div>

      {/* Buffer B */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          frontIsA ? "opacity-0" : "opacity-100"
        }`}
      >
        {fileB && (
          <Document
            key={fileB}
            file={fileB}
            onLoadError={(e) => console.error("PDF load error:", e)}
            loading={null}
            noData={null}
          >
            <Page pageNumber={1} renderMode="canvas" width={w} height={h} />
          </Document>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-32 z-50 flex space-x-4">
        <button
          onClick={() => setPause((p) => !p)}
          className="bg-white border-4 border-blue-500 h-[60px] w-[60px] rounded-full flex items-center justify-center text-blue-500 text-2xl shadow"
        >
          {pause ? <FaPlay /> : <HiPause />}
        </button>
        {pause && (
          <>
            <button
              onClick={prev}
              className="bg-white border-4 border-blue-500 h-[60px] w-[60px] rounded-full flex items-center justify-center text-blue-500 text-2xl shadow"
            >
              <IoIosArrowBack />
            </button>
            <button
              onClick={next}
              className="bg-white border-4 border-blue-500 h-[60px] w-[60px] rounded-full flex items-center justify-center text-blue-500 text-2xl shadow"
            >
              <IoIosArrowForward />
            </button>
          </>
        )}
      </div>

      {/* Countdown ring */}
      {!pause && (
        <div className="absolute bottom-6 bg-white rounded-full shadow-md right-6 z-50 w-[60px] h-[60px] grid place-items-center">
          <svg width="60" height="60" className="-rotate-90">
            <circle cx="30" cy="30" r={R} fill="none" stroke="#eee" strokeWidth="4" />
            <circle
              cx="30"
              cy="30"
              r={R}
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeDasharray={C}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-orange-500  font-bold text-xl">{sec}</span>
        </div>
      )}
    </div>
  );
};
