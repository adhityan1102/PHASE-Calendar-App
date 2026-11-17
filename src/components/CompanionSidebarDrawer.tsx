import React from 'react';
import {
  X,
  FileText,
  Settings,
  Calendar,
  Compass,
  BarChart3,
  Edit3,
  Clock,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import { PdfDocType } from './PdfViewerModal';

interface CompanionSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTabIndex: number;
  onSelectTab: (index: number) => void;
  onOpenPdf: (docType: PdfDocType) => void;
  onOpenSettings: () => void;
  onOpenEditDay: () => void;
  onSyncSmartDate: () => void;
  onScrollToHero: () => void;
  studentName: string;
  activeSection: string;
  paletteName: string;
  selectedDate: string;
}

export const CompanionSidebarDrawer: React.FC<CompanionSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeTabIndex,
  onSelectTab,
  onOpenPdf,
  onOpenSettings,
  onOpenEditDay,
  onSyncSmartDate,
  onScrollToHero,
  studentName,
  activeSection,
  paletteName,
  selectedDate,
}) => {
  if (!isOpen) return null;

  const navItems = [
    {
      index: 0,
      label: 'Tomorrow',
      sub: 'Morning, afternoon, FAT & Funwork portions',
      icon: Compass,
    },
    {
      index: 1,
      label: 'Schedule',
      sub: 'Official PHASE timeline & date browser',
      icon: Calendar,
    },
    {
      index: 2,
      label: 'Analytics',
      sub: 'Averages, subject totals & marks register',
      icon: BarChart3,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Companion Navigation and Settings Sidebar"
      data-testid="companion-sidebar-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="w-full max-w-xs sm:max-w-sm h-full bg-[var(--surface)] border-l border-[var(--border)] text-[var(--text)] flex flex-col justify-between overflow-y-auto"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] block">
                PHASE · {activeSection || 'CLASS 10'}
              </span>
              <h2 className="text-base font-bold text-[var(--text)] mt-0.5">
                {studentName || 'Student'}
              </h2>
              <span className="text-[11px] text-[var(--text-secondary)] block mt-0.5">
                {paletteName}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Sidebar"
              className="w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Primary Views */}
          <div className="space-y-1.5">
            <span className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)] block mb-2">
              Workspace Views
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTabIndex === item.index;
              return (
                <button
                  key={item.index}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.index);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--surface-elevated)]/60 hover:bg-[var(--surface-elevated)] text-[var(--text)] border-[var(--border)]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-[var(--bg)]' : 'text-[var(--text-secondary)]'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold block truncate">
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] block truncate ${
                        isSelected ? 'opacity-80' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {item.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 2. Official PDF Documents */}
          <div className="space-y-2">
            <span className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)] block">
              Official PDFs (Full-Screen Viewer)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPdf('schedule');
                }}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-left flex flex-col gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[var(--accent-brand)]" />
                <span className="text-xs font-semibold text-[var(--text)]">
                  schedule.pdf
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  10A–10E Timetable
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPdf('syllabus');
                }}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-left flex flex-col gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[var(--accent-brand)]" />
                <span className="text-xs font-semibold text-[var(--text)]">
                  syllabus.pdf
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  PHASE Syllabus
                </span>
              </button>
            </div>
          </div>

          {/* 3. Schedule Tools */}
          <div className="space-y-2">
            <span className="px-1 text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--text-muted)] block">
              Day Utilities
            </span>

            <button
              type="button"
              onClick={() => {
                onSyncSmartDate();
                onClose();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Jump to Scheduled Day</span>
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {selectedDate}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditDay();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Customize Current Day Portions</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onScrollToHero();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <ArrowUp className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Return to Board Exam Timer</span>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Primary Settings Button */}
        <div className="p-5 border-t border-[var(--border)] bg-[var(--surface-elevated)]/60">
          <button
            type="button"
            data-testid="sidebar-open-settings"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-semibold flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Settings, Themes &amp; Offline Cache</span>
            </span>
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </aside>
    </div>
  );
};
