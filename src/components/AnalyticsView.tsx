import React, { useState } from 'react';
import { OverallAnalyticsSummary } from '../types';
import { CloudMarksSubmissionRecord } from '../firebase';
import {
  ClipboardEdit,
  TrendingUp,
  CloudUpload,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronDown,
  Lock,
} from 'lucide-react';

interface AnalyticsViewProps {
  summary: OverallAnalyticsSummary;
  onOpenMarksRegister: () => void;
  authUserEmail: string | null;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  cloudSyncError: string | null;
  onConnectAndUpload: () => void;
  isOwner: boolean;
  ownerSubmissions: CloudMarksSubmissionRecord[];
  ownerSubmissionsLoading: boolean;
  onRefreshOwnerSubmissions: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  summary,
  onOpenMarksRegister,
  authUserEmail,
  cloudSyncStatus,
  cloudSyncError,
  onConnectAndUpload,
  isOwner,
  ownerSubmissions,
  ownerSubmissionsLoading,
  onRefreshOwnerSubmissions,
}) => {
  const [ownerFilterSection, setOwnerFilterSection] = useState<string>('ALL');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const filteredSubmissions = ownerSubmissions.filter((sub) =>
    ownerFilterSection === 'ALL' ? true : sub.classSection === ownerFilterSection
  );

  return (
    <div data-testid="analytics-view" className="space-y-4 pb-6">
      {/* Primary Metrics: Current Average + Marks Secured out of Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          className="p-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Current Average
            </span>
            <TrendingUp className="w-4 h-4 text-[var(--accent-brand)]" />
          </div>
          <div
            data-testid="analytics-current-average"
            className="text-3xl sm:text-4xl font-mono tabular-nums font-extrabold text-[var(--text)]"
          >
            {summary.overallAveragePercent !== null
              ? `${summary.overallAveragePercent}%`
              : '—%'}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            {summary.totalEnteredSessions} of {summary.totalConductedSessions} conducted sessions recorded
          </p>
        </div>

        <div
          className="p-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-1.5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider block">
            Marks Secured
          </span>
          <div
            data-testid="analytics-marks-secured"
            className="text-3xl sm:text-4xl font-mono tabular-nums font-extrabold text-[var(--text)]"
          >
            {summary.totalMarksSecured}
            <span className="text-lg sm:text-xl font-semibold text-[var(--text-muted)]">
              {' '}
              / {summary.totalPossibleEntered}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Out of {summary.totalSessions} total PHASE sessions
          </p>
        </div>
      </div>

      {/* Subject-Wise Breakdown */}
      <div
        className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-elevated)]/60 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          <span>Subject</span>
          <div className="flex items-center gap-6 sm:gap-10">
            <span>Marks / Total</span>
            <span className="w-14 text-right">Average</span>
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {summary.subjects.map((subj) => (
            <div
              key={subj.subjectKey}
              data-testid={`analytics-subject-${subj.subjectKey}`}
              className="px-5 py-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <strong className="block text-sm font-semibold text-[var(--text)] truncate">
                  {subj.subjectName}
                </strong>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {subj.enteredSessions}/{subj.totalSessions} sessions entered
                </span>
              </div>

              <div className="flex items-center gap-6 sm:gap-10 shrink-0 font-mono tabular-nums">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]">
                  {subj.marksSecured} / {subj.totalPossibleEntered}
                </span>
                <span className="w-14 text-right text-sm font-bold text-[var(--text)]">
                  {subj.averagePercent !== null ? `${subj.averagePercent}%` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Marks CTA Button */}
      <button
        type="button"
        data-testid="register-marks-button"
        onClick={onOpenMarksRegister}
        className="w-full py-4 px-5 rounded-2xl bg-[var(--text)] text-[var(--bg)] font-semibold text-sm flex items-center justify-center gap-2.5 hover:opacity-92 active:scale-[0.99] transition-all cursor-pointer"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <ClipboardEdit className="w-4 h-4" />
        <span>Register Marks to Analyse</span>
      </button>

      {/* Private Cloud Upload Card (Students upload their own marks privately) */}
      <div
        className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)]">
            {cloudSyncStatus === 'synced' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[var(--accent-brand)] shrink-0" />
            )}
            <span>
              {authUserEmail
                ? cloudSyncStatus === 'synced'
                  ? 'Marks Uploaded to Cloud'
                  : cloudSyncStatus === 'syncing'
                  ? 'Uploading Marks to Cloud...'
                  : 'Private Cloud Sync Ready'
                : 'Cloud Submission'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] truncate">
            {cloudSyncError
              ? cloudSyncError
              : authUserEmail
              ? `Synced as ${authUserEmail} (only viewable by the site administrator)`
              : 'Sign in with Google to upload your marks privately.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onConnectAndUpload}
          disabled={cloudSyncStatus === 'syncing'}
          data-testid="cloud-upload-marks-button"
          className="px-4 py-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-60"
        >
          {cloudSyncStatus === 'syncing' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CloudUpload className="w-3.5 h-3.5" />
          )}
          <span>{authUserEmail ? 'Sync Now' : 'Sign in & Upload'}</span>
        </button>
      </div>

      {/* Owner-Only View of Submitted Student Marks (Never visible to regular students) */}
      {isOwner && (
        <div
          data-testid="owner-cloud-submissions-panel"
          className="rounded-3xl border border-[var(--border-strong)] bg-[var(--surface)] overflow-hidden space-y-3 p-4 sm:p-5"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text)]">
                Submitted Student Marks (Owner Only)
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {ownerSubmissions.length} student record{ownerSubmissions.length === 1 ? '' : 's'} synced
              </p>
            </div>

            <button
              type="button"
              onClick={onRefreshOwnerSubmissions}
              disabled={ownerSubmissionsLoading}
              className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${ownerSubmissionsLoading ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
          </div>

          {/* Section Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', '10A', '10B', '10C', '10D', '10E'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setOwnerFilterSection(sec)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold cursor-pointer transition-colors ${
                  ownerFilterSection === sec
                    ? 'bg-[var(--text)] text-[var(--bg)]'
                    : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/40">
              No uploaded student marks found for this filter yet.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubmissions.map((sub) => {
                const isExpanded = expandedStudentId === sub.id;
                const markEntries = Object.entries(sub.marks || {}).sort(([a], [b]) =>
                  a.localeCompare(b)
                );
                return (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedStudentId(isExpanded ? null : sub.id)
                      }
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs sm:text-sm font-bold text-[var(--text)] truncate">
                            {sub.studentName}
                          </strong>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                            {sub.classSection}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] block truncate">
                          {sub.studentEmail} · {sub.enteredCount} sessions
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                        <div className="text-right">
                          <span className="block text-sm font-extrabold text-[var(--text)]">
                            {sub.averagePercent}%
                          </span>
                          <span className="block text-[10px] text-[var(--text-muted)]">
                            {sub.totalMarksSecured}/{sub.totalPossibleEntered}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-3 pt-2 border-t border-[var(--border)] bg-[var(--surface)]">
                        {markEntries.length === 0 ? (
                          <span className="text-[11px] text-[var(--text-muted)]">
                            No individual marks saved yet.
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {markEntries.map(([code, score]) => (
                              <span
                                key={code}
                                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] font-mono text-[11px] text-[var(--text)]"
                              >
                                {code}: <strong>{score}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
