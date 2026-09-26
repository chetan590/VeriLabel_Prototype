import React from 'react';
import {
  Lightbulb,
  Camera,
  Cpu,
  Scale,
  FileText
} from 'lucide-react';
import { useI18n } from '../i18n';
import { DashboardActions } from './DashboardActions';

interface OverviewTabProps {
  onNavigateToScanner: () => void;
  onNavigateToTeam: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateToScanner,
  onNavigateToTeam
}) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto space-y-6 sm:space-y-8 pb-12 font-sans">
      {/* Friendly Hero Header Section */}
      <section className="flex flex-col items-center text-center pt-2 space-y-3 sm:space-y-4">
        <h1 className="font-display text-2xl sm:text-4xl text-[#131b2e] font-bold tracking-tight max-w-2xl">
          {t('homeHero')}
        </h1>

        <p className="text-sm sm:text-base text-[#434655] max-w-md mx-auto leading-relaxed">
          {t('homeSub')}
        </p>

        {/* CTAs Stacked Cleanly for Mobile — NO TEXT ARROWS */}
        <DashboardActions
          onNavigateToScanner={onNavigateToScanner}
          onNavigateToTeam={onNavigateToTeam}
        />
      </section>

      {/* Product Demo Walkthrough Video */}
      <section className="w-full max-w-3xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-2xl border border-[#c3c6d7]/30 bg-slate-900 shadow-xs aspect-video">
          <video
            className="h-full w-full object-cover"
            src="/assets/Video_VeriLabel.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            aria-label={t('demo')}
          />
        </div>
      </section>

      {/* Plain Language Overview Card */}
      <section className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-5 border border-[#c3c6d7]/30">
        <div className="flex items-center gap-2.5 text-[#004ac6]">
          <Lightbulb className="w-5 h-5 text-[#004ac6]" />
          <h2 className="font-display text-lg sm:text-xl text-[#131b2e] font-bold">
            {t('whatDoes')}
          </h2>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
            <div className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#131b2e] block">
                {t('step1')}
              </span>
              <span className="text-xs text-[#434655] leading-relaxed">
                {t('step1d')}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
            <div className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#131b2e] block">
                {t('step2')}
              </span>
              <span className="text-xs text-[#434655] leading-relaxed">
                {t('step2d')}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
            <div className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#131b2e] block">
                {t('step3')}
              </span>
              <span className="text-xs text-[#434655] leading-relaxed">
                {t('step3d')}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
            <div className="w-9 h-9 rounded-lg bg-[#e2e7ff] text-[#004ac6] flex items-center justify-center shrink-0 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-sm text-[#131b2e] block">
                {t('step4')}
              </span>
              <span className="text-xs text-[#434655] leading-relaxed">
                {t('step4d')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="pt-4 pb-2 text-center text-xs text-[#434655]">
        <p>{t('pagePrototype')}</p>
      </footer>
    </div>
  );
};
