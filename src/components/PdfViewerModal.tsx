import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Loader2,
} from 'lucide-react';

// Configure local worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export type PdfDocType = 'schedule' | 'syllabus';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: PdfDocType;
  activeTheme: 'dark' | 'light';
}

const SYLLABUS_QUICK_JUMPS = [
  { label: 'Schedule', page: 6 },
  { label: 'Pre-Boards', page: 7 },
  { label: 'Social', page: 1 },
  { label: 'Physics', page: 2 },
  { label: 'Maths', page: 5 },
  { label: 'Tamil', page: 8 },
  { label: 'Chemistry', page: 12 },
  { label: 'Biology', page: 13 },
  { label: 'Blueprints', page: 14 },
  { label: 'English', page: 18 },
];

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'schedule',
}) => {
  const [activeDoc, setActiveDoc] = useState<PdfDocType>(initialDoc);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  // Default zoom strictly 60% per user request
  const [scale, setScale] = useState(0.6);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loadedPdf, setLoadedPdf] = useState<{ doc: any; url: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // schedule.pdf displays the 10A-10E timetable; syllabus.pdf displays the PHASE Syllabus PDF
  const docUrl =
    activeDoc === 'schedule' ? '/updated_timetable.pdf' : '/schedule.pdf';

  const docTitle =
    activeDoc === 'schedule' ? 'schedule.pdf' : 'syllabus.pdf';

  useEffect(() => {
    if (isOpen) {
      setLoadedPdf(null);
      setLoading(true);
      setActiveDoc(initialDoc);
      setPageNum(initialDoc === 'syllabus' ? 6 : 1);
      setScale(0.6);
    } else {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
      setLoadedPdf(null);
    }
  }, [initialDoc, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    let loadingTask: any = null;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        setLoadedPdf(null);
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        loadingTask = pdfjsLib.getDocument({ url: docUrl });
        const pdf = await loadingTask.promise;
        if (!mounted) {
          pdf.destroy?.();
          return;
        }
        setLoadedPdf({ doc: pdf, url: docUrl });
        setNumPages(pdf.numPages);
        setPageNum((prev) => Math.min(Math.max(1, prev), pdf.numPages));
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        console.warn('PDF load error:', err);
        setErrorMsg('Unable to render PDF canvas.');
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      mounted = false;
      if (loadingTask?.destroy) {
        loadingTask.destroy().catch(() => {});
      }
    };
  }, [docUrl, isOpen]);

  useEffect(() => {
    if (!isOpen || loading || !loadedPdf || loadedPdf.url !== docUrl) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const safePageNum = Math.min(Math.max(1, pageNum), loadedPdf.doc.numPages);
        const page = await loadedPdf.doc.getPage(safePageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          transform: transform || undefined,
          viewport,
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Page render error:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pageNum, scale, rotation, isOpen, docUrl, loadedPdf, loading]);

  if (!isOpen) return null;

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const handleNextPage = () => {
    if (numPages && pageNum < numPages) setPageNum(pageNum + 1);
  };

  const handleSwitchDoc = (nextDoc: PdfDocType) => {
    if (nextDoc === activeDoc) return;
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    setLoadedPdf(null);
    setLoading(true);
    setNumPages(null);
    setActiveDoc(nextDoc);
    setPageNum(nextDoc === 'syllabus' ? 6 : 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-Screen PDF Viewer"
      data-testid="pdf-viewer-modal"
      className="fixed inset-0 z-50 w-screen h-[100dvh] bg-neutral-950 text-white overflow-hidden"
    >
      {/* Floating Top-Left Fully See-Through Close Symbol */}
      <button
        type="button"
        onClick={onClose}
        data-testid="close-pdf-viewer"
        aria-label="Close PDF Viewer"
        className="fixed top-2.5 left-2.5 z-[60] p-2 bg-transparent border-0 text-white/95 hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] transition-opacity cursor-pointer"
      >
        <X className="w-6 h-6" strokeWidth={2.4} />
      </button>

      {/* Top Controls Overlay (Shifted right of floating X so PDF flows directly underneath the left corner) */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none pl-12 pr-2.5 pt-2 flex flex-col gap-1.5 items-end sm:items-center">
        <div className="pointer-events-auto max-w-full flex flex-wrap items-center justify-end sm:justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900/80 backdrop-blur-md border border-white/15 text-xs">
          {/* Document Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40">
            <button
              type="button"
              data-testid="pdf-tab-schedule"
              onClick={() => handleSwitchDoc('schedule')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeDoc === 'schedule'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              schedule.pdf
            </button>
            <button
              type="button"
              data-testid="pdf-tab-syllabus"
              onClick={() => handleSwitchDoc('syllabus')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeDoc === 'syllabus'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              syllabus.pdf
            </button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={pageNum <= 1}
              aria-label="Previous Page"
              className="p-1 rounded-md hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono tabular-nums text-[11px] px-1">
              {pageNum}/{numPages || '—'}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={numPages ? pageNum >= numPages : true}
              aria-label="Next Page"
              className="p-1 rounded-md hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom & Rotate */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setScale((prev) => Math.max(Number((prev - 0.1).toFixed(2)), 0.35))}
              aria-label="Zoom Out"
              className="p-1 rounded-md hover:bg-white/10 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span
              data-testid="pdf-zoom-value"
              className="font-mono tabular-nums text-[11px] w-9 text-center"
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setScale((prev) => Math.min(Number((prev + 0.1).toFixed(2)), 2.4))}
              aria-label="Zoom In"
              className="p-1 rounded-md hover:bg-white/10 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              aria-label="Rotate Page"
              className="p-1 rounded-md hover:bg-white/10 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Subject Jumps for Syllabus PDF */}
        {activeDoc === 'syllabus' && (
          <div className="pointer-events-auto max-w-full flex items-center gap-1 overflow-x-auto px-2 py-1 rounded-lg bg-neutral-900/75 backdrop-blur-md border border-white/10">
            {SYLLABUS_QUICK_JUMPS.map((jump) => (
              <button
                key={jump.label}
                type="button"
                onClick={() => setPageNum(jump.page)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  pageNum === jump.page
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {jump.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edge-to-Edge Maximized PDF Scroll Area (Runs cleanly underneath transparent left X) */}
      <div className="w-full h-full overflow-auto pt-14 sm:pt-16 pb-6 px-2 flex justify-center items-start">
        {loading && (
          <div className="my-auto flex flex-col items-center gap-2 text-neutral-300">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}

        {errorMsg ? (
          <iframe
            src={`${docUrl}#toolbar=0`}
            title={docTitle}
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          <div className="inline-block shadow-2xl bg-white my-auto">
            <canvas
              ref={canvasRef}
              data-testid="pdf-canvas"
              className="block"
            />
          </div>
        )}
      </div>
    </div>
  );
};
