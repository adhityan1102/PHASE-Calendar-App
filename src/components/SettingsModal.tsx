import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Upload,
  HardDrive,
  Check,
  WifiOff,
  RefreshCw,
  LogOut,
  LogIn,
} from 'lucide-react';
import { StudentProfile } from '../types';
import {
  THEME_PALETTES,
  ThemePaletteId,
  ThemePaletteMeta,
} from '../utils/companionLogic';

export interface DeviceCacheStatus {
  enabled: boolean;
  state: 'idle' | 'caching' | 'ready' | 'error';
  cachedFilesCount: number;
  lastSyncedAt: string | null;
  message: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  autoTheme: boolean;
  onToggleAutoTheme: (enabled: boolean) => void;
  manualPaletteId: ThemePaletteId;
  onSelectManualPalette: (paletteId: ThemePaletteId) => void;
  activePalette: ThemePaletteMeta;
  deviceCacheStatus: DeviceCacheStatus;
  onToggleDeviceCache: (enabled: boolean) => void;
  onPreviewOfflineAck: () => void;
  onPreviewSplashScreen: () => void;
  morningTime: string;
  onSaveMorningTime: (time: string) => void;
  eveningTime: string;
  onSaveEveningTime: (time: string) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  authUserEmail: string | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  activeSection,
  onSelectSection,
  autoTheme,
  onToggleAutoTheme,
  manualPaletteId,
  onSelectManualPalette,
  activePalette,
  deviceCacheStatus,
  onToggleDeviceCache,
  onPreviewOfflineAck,
  onPreviewSplashScreen,
  morningTime,
  onSaveMorningTime,
  eveningTime,
  onSaveEveningTime,
  onExportBackup,
  onImportBackup,
  authUserEmail,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [mTime, setMTime] = useState(morningTime);
  const [eTime, setETime] = useState(eveningTime);

  useEffect(() => {
    setName(profile.name || '');
    setEmail(profile.email || '');
    setMTime(morningTime);
    setETime(eveningTime);
  }, [profile, morningTime, eveningTime, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      name: name.trim() || 'Student',
      email: email.trim(),
      classSection: activeSection ? `Class ${activeSection}` : 'Class 10A',
    });
    onSaveMorningTime(mTime);
    onSaveEveningTime(eTime);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings, Themes, Class Section and Offline Device Cache"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex flex-col w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] overflow-hidden"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
              PHASE Settings &amp; Studio
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Colour Schemes, Class Section, Profile, Cloud Account &amp; Offline Cache
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto max-h-[76vh]">
          {/* 1. Time-Based & Multi-Palette Theme Studio */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <strong className="text-xs sm:text-sm block font-semibold text-[var(--text)]">
                  Time-Based Automatic Colour Schemes
                </strong>
                <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                  Dawn Ivory (5 AM–12 PM) · Ceramic Daylight (12 PM–5 PM) · Dusk Horizon (5 PM–9 PM) · Obsidian Nocturne (9 PM–5 AM)
                </span>
              </div>
              <input
                type="checkbox"
                aria-label="Time-Based Automatic Colour Schemes"
                checked={autoTheme}
                onChange={(e) => onToggleAutoTheme(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer shrink-0"
              />
            </div>

            <div className="pt-3 border-t border-[var(--border)] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--text-secondary)]">
                  {autoTheme
                    ? `Active Time Palette: ${activePalette.name} (${activePalette.timeWindowLabel})`
                    : `Selected Palette: ${activePalette.name}`}
                </span>
                <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">
                  {activePalette.mode}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEME_PALETTES.map((palette) => {
                  const isSelected = activePalette.id === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        onToggleAutoTheme(false);
                        onSelectManualPalette(palette.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-[var(--text)] bg-[var(--surface)]'
                          : 'border-[var(--border)] bg-[var(--surface)]/60 hover:bg-[var(--surface)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: palette.swatchBg }}
                          />
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: palette.swatchAccent }}
                          />
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[var(--text)]" />}
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-[var(--text)] truncate">
                          {palette.name}
                        </span>
                        <span className="block text-[10px] text-[var(--text-muted)] truncate">
                          {palette.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Manual Host Device Browser Cache (Offline Unplugged Protection) */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HardDrive className="w-4 h-4 text-[var(--text-secondary)] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-xs sm:text-sm block font-semibold text-[var(--text)]">
                    Upload Site to Host Device Browser Cache
                  </strong>
                  <span className="text-[11px] text-[var(--text-muted)] block mt-0.5 leading-relaxed">
                    Manual toggle (never automatic). Stores the entire app, schedule, and PDFs directly in your browser cache so everything works offline with acknowledgement.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Upload Site to Host Device Browser Cache"
                checked={deviceCacheStatus.enabled}
                onChange={(e) => onToggleDeviceCache(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer shrink-0"
              />
            </div>

            <div className="pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                {deviceCacheStatus.state === 'caching' && 'Uploading assets to device browser cache...'}
                {deviceCacheStatus.state === 'ready' &&
                  `Cached on Device (${deviceCacheStatus.cachedFilesCount} files ready offline)`}
                {deviceCacheStatus.state === 'idle' && 'Device Cache Off · Standard network mode'}
                {deviceCacheStatus.state === 'error' && deviceCacheStatus.message}
              </span>

              <div className="flex items-center gap-2">
                {deviceCacheStatus.enabled && (
                  <button
                    type="button"
                    onClick={() => onToggleDeviceCache(true)}
                    className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[11px] font-medium text-[var(--text)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-Sync Cache</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onPreviewOfflineAck}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <WifiOff className="w-3 h-3" />
                  <span>Test Offline Acknowledgement</span>
                </button>
                <button
                  type="button"
                  onClick={onPreviewSplashScreen}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Preview Launch Splash</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Cloud Account Sync */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <strong className="text-xs sm:text-sm block font-semibold text-[var(--text)]">
                Google Cloud Analytics Sync
              </strong>
              <span className="text-[11px] text-[var(--text-muted)] block truncate mt-0.5">
                {authUserEmail
                  ? `Connected as ${authUserEmail}`
                  : 'Sign in with Google to upload your Analytics marks'}
              </span>
            </div>
            {authUserEmail ? (
              <button
                type="button"
                onClick={onGoogleSignOut}
                className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoogleSignIn}
                className="px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Google</span>
              </button>
            )}
          </div>

          {/* 4. Class Section Selector (10A–10E) & Student Profile */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Class Section &amp; Student Profile
            </label>

            <div>
              <span className="text-xs text-[var(--text-secondary)] block mb-1.5">
                Active Class Section (Updates Morning &amp; Afternoon Timetable)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {['10A', '10B', '10C', '10D', '10E'].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onSelectSection(sec)}
                    className={`py-2 rounded-xl border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      activeSection === sec
                        ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                        : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)]'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block mb-1">Student Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-[var(--text-secondary)] block mb-1">Gmail Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Test Timings */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Session Exam Timings
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block mb-1">Morning Test</span>
                <input
                  type="time"
                  value={mTime}
                  onChange={(e) => setMTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] font-mono text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <span className="text-xs text-[var(--text-secondary)] block mb-1">Afternoon Test</span>
                <input
                  type="time"
                  value={eTime}
                  onChange={(e) => setETime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] font-mono text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* 6. Backup & Restore */}
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] block">
              Data Backup (.json)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onExportBackup}
                className="flex-1 py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup (.json)</span>
              </button>

              <label className="flex-1 py-2 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
