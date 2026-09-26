import React, { useState } from 'react';
import { SAMPLE_DATASETS } from '../data/presets';
import { SampleDataset } from '../types';
import { PhotosGrid } from './PhotosGrid';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';
import { PipelineStepper } from './PipelineStepper';
import { ResultsPanel } from './ResultsPanel';
import { generateInspectionPdf } from '../services/pdfService';
import {
  Image as ImageIcon,
  CheckCircle2,
  FlipHorizontal,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n } from '../i18n';

export const ScannerTab: React.FC = () => {
  const { t, language } = useI18n();
  const [activeSample, setActiveSample] = useState<SampleDataset | null>(null);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [isPhotosGridOpen, setIsPhotosGridOpen] = useState<boolean>(false);

  // Simulated Scanning & Pipeline State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [stageLabel, setStageLabel] = useState<string>(t('ready'));
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(false);

  // PDF Generation State
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Run the 3-4s simulated pipeline animation
  const runSimulatedScan = (sampleToLoad: SampleDataset) => {
    setIsScanning(true);
    setHasProcessed(false);
    setShowBoundingBoxes(false);
    setStageIndex(0);
    setStageProgress(5);
    setStageLabel('Pre-processing image and enhancing contrast...');

    // Stage 1: Pre-processing (0 - 800ms)
    setTimeout(() => {
      setStageIndex(0);
      setStageProgress(25);
      setStageLabel('Binarizing typography & isolating text regions...');
    }, 800);

    // Stage 2: OCR (800ms - 1800ms)
    setTimeout(() => {
      setStageIndex(1);
      setStageProgress(50);
      setStageLabel('Extracting optical characters & text tokens...');
    }, 1800);

    // Stage 3: Rule Validation (1800ms - 2800ms)
    setTimeout(() => {
      setStageIndex(2);
      setStageProgress(75);
      setStageLabel('Validating declarations against PCR 2011 Rule 6 & 11...');
    }, 2800);

    // Stage 4: Verdict (2800ms - 3500ms)
    setTimeout(() => {
      setStageIndex(3);
      setStageProgress(100);
      setStageLabel('Finalizing compliance verdict & bounding boxes...');
    }, 3400);

    // Complete buffer and reveal bounding boxes (3600ms)
    setTimeout(() => {
      setIsScanning(false);
      setHasProcessed(true);
      setShowBoundingBoxes(true);

      if (sampleToLoad.defaultStatus === 'COMPLIANT') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
        showToast(`${t('compliant')} • PCR 2011 declarations verified`);
      } else {
        showToast(`Loaded ${sampleToLoad.name}`);
      }
    }, 3600);
  };

  // Select Sample from Photos Grid: Choose Image -> Selection -> Processing -> Output
  const handleSelectFromLibrary = (sample: SampleDataset) => {
    setIsPhotosGridOpen(false);
    setActiveSample(sample);
    runSimulatedScan(sample);
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    if (!activeSample) return;
    try {
      setIsGeneratingPdf(true);
      await generateInspectionPdf(activeSample, { language });
      showToast(t('pdfDownloaded'));
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Error generating PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto space-y-5 pb-16 font-sans">
      {/* Top Intro Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
          {t('scannerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('scannerSub')}
        </p>
      </div>

      {/* UPI-style Camera Viewfinder Frame */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80">
        {activeSample ? (
          /* Background Image Viewport when an image is selected */
          <div
            className="relative w-full h-72 sm:h-80 bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url('${activeSample.imagePath}')` }}
          >
            {/* Dark gradient overlay like UPI scan screen */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

            {/* Top info tag on viewfinder */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30">
              <div className="px-3 py-1 rounded-md bg-black/50 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[220px]">Active: {activeSample.name}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsPhotosGridOpen(true)}
                className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
                title="Switch Product"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Laser Alignment Frame */}
            <div className="absolute inset-6 pointer-events-none flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 border-t-4 border-l-4 border-[#004ac6] rounded-tl-lg" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-[#004ac6] rounded-tr-lg" />
              </div>

              {/* Laser animated horizontal line during scanning */}
              {isScanning && (
                <div className="relative w-full h-[2px] bg-linear-to-r from-transparent via-[#2563eb] to-transparent shadow-[0_0_12px_#2563eb] animate-pulse my-auto" />
              )}

              <div className="flex justify-between items-end">
                <div className="w-8 h-8 border-b-4 border-l-4 border-[#004ac6] rounded-bl-lg" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-[#004ac6] rounded-br-lg" />
              </div>
            </div>

            {/* Bounding Box Overlays (Visible only after processing is complete) */}
            <BoundingBoxOverlay
              boxes={activeSample.boundingBoxes}
              isVisible={showBoundingBoxes && hasProcessed && !isScanning}
            />
          </div>
        ) : (
          /* Empty Viewfinder State before selection (NO placeholder or default image) */
          <div className="relative w-full h-72 sm:h-80 bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
            {/* Viewfinder corner brackets */}
            <div className="absolute inset-6 pointer-events-none flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 border-t-4 border-l-4 border-[#004ac6] rounded-tl-lg" />
                <div className="w-8 h-8 border-t-4 border-r-4 border-[#004ac6] rounded-tr-lg" />
              </div>
              <div className="flex justify-between items-end">
                <div className="w-8 h-8 border-b-4 border-l-4 border-[#004ac6] rounded-bl-lg" />
                <div className="w-8 h-8 border-b-4 border-r-4 border-[#004ac6] rounded-br-lg" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 border border-white/15">
                <ImageIcon className="w-7 h-7 text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {t('noImage')}
                </span>
                <span className="text-slate-400 text-xs max-w-xs">
                  {t('chooseToBegin')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Section: ONLY "Choose from Library" */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsPhotosGridOpen(true)}
          disabled={isScanning}
          className="w-full py-3.5 px-6 rounded-xl bg-[#004ac6] hover:bg-[#003ea8] active:bg-[#00174b] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <ImageIcon className="w-5 h-5" />
          <span>{t('chooseLibrary')}</span>
        </button>
      </div>

      {/* Pipeline Stepper (Visible during processing) */}
      {isScanning && (
        <PipelineStepper
          currentStageIndex={stageIndex}
          stageProgress={stageProgress}
          stageLabel={stageLabel}
        />
      )}

      {/* Output: Inspection Results Dossier (Visible only after processing) */}
      {hasProcessed && !isScanning && activeSample && (
        <>
          <ResultsPanel
            sample={activeSample}
            onDownloadPdf={handleDownloadPdf}
            isGeneratingPdf={isGeneratingPdf}
          />

          {/* Secondary Bottom Action: Test Another Product from Library */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsPhotosGridOpen(true)}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-[#004ac6]" />
              <span>{t('chooseAnother')}</span>
            </button>
          </div>
        </>
      )}

      {/* Native iOS Photos Grid Picker */}
      <PhotosGrid
        isOpen={isPhotosGridOpen}
        samples={SAMPLE_DATASETS}
        onSelectSample={handleSelectFromLibrary}
        onCancel={() => setIsPhotosGridOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between transition-all duration-300 z-50 animate-slideUp">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
