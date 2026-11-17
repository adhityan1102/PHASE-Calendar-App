import React, { useState, useEffect } from 'react';
import { CBSE_2027_EXAM_CONFIG } from '../data/scheduleData';
import {
  calculateCountdown,
  DeviceFormattingStyles,
} from '../utils/companionLogic';
import { ChevronUp, Menu } from 'lucide-react';

interface StickyNotificationIslandProps {
  isWorkspaceActive: boolean;
  isTopBarVisible: boolean;
  onScrollToTop: () => void;
  onOpenSidebar: () => void;
  currentDateTime: Date;
  deviceStyles: DeviceFormattingStyles;
}

export const StickyNotificationIsland: React.FC<StickyNotificationIslandProps> = ({
  isWorkspaceActive,
  isTopBarVisible,
  onScrollToTop,
  onOpenSidebar,
  currentDateTime,
  deviceStyles,
}) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateCountdown(CBSE_2027_EXAM_CONFIG.firstExamDate)
  );

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateCountdown(CBSE_2027_EXAM_CONFIG.firstExamDate));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeDisplay = currentDateTime.toLocaleTimeString('en-IN', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
  });

  const showFullBar = isWorkspaceActive && isTopBarVisible;

  return (
    <header
      aria-label="Top Bar"
      data-testid="spawned-top-bar"
      className={`fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/92 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        showFullBar
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{
        height: `${deviceStyles.topBarHeightPx}px`,
      }}
    >
      <div
        className="h-full mx-auto flex items-center justify-between gap-2"
        style={{
          maxWidth: deviceStyles.workspaceMaxWidth,
          paddingLeft: deviceStyles.topBarPaddingX,
          paddingRight: deviceStyles.topBarPaddingX,
          fontSize: deviceStyles.topBarFontSize,
        }}
      >
        {/* Left: Unboxed Triple Vertical Stack Button */}
        <button
          type="button"
          onClick={onOpenSidebar}
          data-testid="open-sidebar-button"
          aria-label="Open Menu"
          className="p-1.5 -ml-1.5 text-[var(--text)] hover:opacity-70 flex items-center justify-center transition-opacity cursor-pointer shrink-0 bg-transparent border-0"
        >
          <Menu className="w-5 h-5" strokeWidth={2.1} />
        </button>

        {/* Right: Docked Board Timer Snapshot with Live Time Positioned Underneath */}
        <button
          type="button"
          onClick={onScrollToTop}
          data-testid="top-bar-cbse-timer"
          className="group flex flex-col items-end justify-center leading-none cursor-pointer shrink-0 bg-transparent border-0 py-0.5"
          title="Return to Board Exam Timer"
        >
          <span className="inline-flex items-center gap-1 font-mono tabular-nums font-bold text-[var(--text)] text-[12px] sm:text-[13px]">
            <span>
              {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h{' '}
              {String(timeLeft.minutes).padStart(2, '0')}m{' '}
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:-translate-y-0.5 transition-transform" />
          </span>
          <span
            data-testid="top-bar-current-time"
            className="mt-0.5 font-mono tabular-nums text-[10px] text-[var(--text-muted)] tracking-wide"
          >
            {timeDisplay}
          </span>
        </button>
      </div>
    </header>
  );
};
