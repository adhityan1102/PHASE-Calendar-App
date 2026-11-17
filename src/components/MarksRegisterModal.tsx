import React, { useState } from 'react';
import { OverallAnalyticsSummary, SubjectSessionCell } from '../types';
import { X, Check, Trash2 } from 'lucide-react';

interface MarksRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: OverallAnalyticsSummary;
  activeSection: string;
  onSaveMark: (code: string, marks: number | null) => void;
}

export const MarksRegisterModal: React.FC<MarksRegisterModalProps> = ({
  isOpen,
  onClose,
  summary,
  activeSection,
  onSaveMark,
}) => {
  const [editingCell, setEditingCell] = useState<SubjectSessionCell | null>(null);
  const [draftValue, setDraftValue] = useState<string>('');
  const [inputError, setInputError] = useState<string | null>(null);

  if (!isOpen) return null;

  const openEditor = (cell: SubjectSessionCell) => {
    if (cell.status === 'non-conducted') return;
    setEditingCell(cell);
    setDraftValue(cell.enteredMarks !== null ? String(cell.enteredMarks) : '');
    setInputError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;

    const trimmed = draftValue.trim();
    if (trimmed === '') {
      onSaveMark(editingCell.code, null);
      setEditingCell(null);
      return;
    }

    const parsed = Number(trimmed);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > editingCell.maxMarks) {
      setInputError(`Enter a valid score between 0 and ${editingCell.maxMarks}`);
      return;
    }

    onSaveMark(editingCell.code, Math.round(parsed * 10) / 10);
    setEditingCell(null);
    setInputError(null);
  };

  const handleClearCell = () => {
    if (!editingCell) return;
    onSaveMark(editingCell.code, null);
    setEditingCell(null);
    setInputError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Register Marks to Analyse"
      data-testid="marks-register-page"
      className="fixed inset-0 z-50 w-screen h-[100dvh] bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden animate-fadeIn"
    >
      {/* Top Header */}
      <header className="px-4 sm:px-6 py-3.5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[var(--text)] truncate">
            Session Marks Register · {activeSection}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-600 inline-block" />
              <span>Not Conducted</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Available (Enter Marks)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white border border-slate-400 inline-block" />
              <span>Marks Entered</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          data-testid="close-marks-register"
          aria-label="Close Marks Register"
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable Subject Session Table */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-5 pb-16">
          {summary.subjects.map((subject) => (
            <section
              key={subject.subjectKey}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 space-y-3"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)]">
                    {subject.subjectName}
                  </h3>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {subject.totalSessions} Sessions · {subject.conductedSessions} Conducted
                  </span>
                </div>

                <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                  {subject.marksSecured} / {subject.totalPossibleEntered}
                  {subject.averagePercent !== null && (
                    <span className="ml-2 text-[var(--text)]">
                      ({subject.averagePercent}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Session Matrix Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {subject.cells.map((cell) => {
                  const isRed = cell.status === 'non-conducted';
                  const isGreen = cell.status === 'pending';
                  const isWhite = cell.status === 'entered';

                  return (
                    <button
                      key={cell.code}
                      type="button"
                      disabled={isRed}
                      data-status={cell.status}
                      data-testid={`mark-cell-${cell.code}`}
                      onClick={() => openEditor(cell)}
                      title={
                        isRed
                          ? `${cell.code} scheduled on ${cell.scheduledDate || 'upcoming date'} (Not yet conducted)`
                          : `${cell.code}: ${cell.topic} (${cell.scheduledDate || 'Conducted'})`
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[66px] ${
                        isRed
                          ? 'bg-red-600/90 border-red-500 text-white cursor-not-allowed opacity-95'
                          : isGreen
                          ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white cursor-pointer active:scale-[0.97]'
                          : isWhite
                          ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 cursor-pointer active:scale-[0.97] shadow-sm'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span className="font-mono text-[11px] font-bold tracking-tight">
                          {cell.code}
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            isWhite ? 'text-slate-500' : 'text-white/80'
                          }`}
                        >
                          /{cell.maxMarks}
                        </span>
                      </div>

                      <div className="mt-1.5">
                        {isWhite ? (
                          <span className="font-mono tabular-nums text-sm font-extrabold text-slate-900 block">
                            {cell.enteredMarks}
                          </span>
                        ) : isGreen ? (
                          <span className="text-[10px] font-medium text-white/95 block">
                            Tap to add
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-white/90 block">
                            {cell.scheduledDate ? cell.scheduledDate.slice(5) : 'Upcoming'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Focused Score Entry Dialog */}
      {editingCell && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCell(null);
          }}
        >
          <form
            onSubmit={handleSave}
            className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] p-5 space-y-4"
            style={{ boxShadow: 'var(--shadow-modal)' }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[var(--accent-brand)]">
                  {editingCell.code} · {editingCell.scheduledDate || 'Conducted'}
                </span>
                <h3 className="text-base font-bold text-[var(--text)] mt-0.5">
                  {editingCell.subjectName}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">
                  {editingCell.topic}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                aria-label="Cancel score entry"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Marks Secured (Out of {editingCell.maxMarks})
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={editingCell.maxMarks}
                autoFocus
                data-testid="marks-entry-input"
                value={draftValue}
                onChange={(e) => {
                  setDraftValue(e.target.value);
                  setInputError(null);
                }}
                placeholder={`0 – ${editingCell.maxMarks}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text)] font-mono text-lg font-bold outline-none"
              />
              {inputError && (
                <p className="text-xs text-red-500 mt-1">{inputError}</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              {editingCell.enteredMarks !== null ? (
                <button
                  type="button"
                  onClick={handleClearCell}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-red-500 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCell(null)}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  data-testid="save-marks-entry"
                  className="px-4 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
