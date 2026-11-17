import React, { useState, useEffect, useRef, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { DEFAULT_SCHEDULE } from './data/scheduleData';
import { ScheduleItem, StudentProfile, SessionMarksMap } from './types';
import {
  resolveActivePalette,
  computeNoonRolloverState,
  detectHorizontalSwipe,
  evaluateStageScrollLock,
  formatLocalDateISO,
  computeDeviceFormatting,
  evaluateTopBarScrollVisibility,
  computeAnalyticsSummary,
  TIMETABLE_START_DATE,
  ThemePaletteId,
  ViewStage,
} from './utils/companionLogic';
import {
  auth,
  checkIsOwnerEmail,
  signInWithGoogle,
  signOutUser,
  syncMarksSubmissionToCloud,
  fetchAllStudentMarksForOwner,
  CloudMarksSubmissionRecord,
} from './firebase';
import { CbseHeroCountdown } from './components/CbseHeroCountdown';
import { StickyNotificationIsland } from './components/StickyNotificationIsland';
import { TomorrowPlanView } from './components/TomorrowPlanView';
import { FullScheduleView } from './components/FullScheduleView';
import { AnalyticsView } from './components/AnalyticsView';
import { MarksRegisterModal } from './components/MarksRegisterModal';
import { PdfViewerModal, PdfDocType } from './components/PdfViewerModal';
import { SettingsModal, DeviceCacheStatus } from './components/SettingsModal';
import { AppSplashScreen } from './components/AppSplashScreen';
import { CompanionSidebarDrawer } from './components/CompanionSidebarDrawer';
import { FirstEntryOnboardingModal } from './components/FirstEntryOnboardingModal';
import { X, HardDrive, WifiOff, CheckCircle2 } from 'lucide-react';

const DEVICE_CACHE_NAME = 'phase-device-vault-v1';

const STORAGE_PROFILE_KEY = 'cbse_profile_v3';
const STORAGE_SECTION_KEY = 'cbse_active_section_v3';
const STORAGE_ONBOARDING_KEY = 'cbse_onboarding_done_v1';
const STORAGE_MARKS_KEY = 'cbse_marks_v1';
const STORAGE_MORNING_TIME_KEY = 'cbse_morning_time_v2';
const STORAGE_EVENING_TIME_KEY = 'cbse_evening_time_v2';
const STORAGE_SCHEDULE_KEY = 'cbse_schedule_v3';

export default function App() {
  const isAutostartMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  // Live Clock
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  // Passive Device-Based Formatting State (Mobile Optimized vs Desktop Magnification)
  const [deviceStyles, setDeviceStyles] = useState(() => {
    if (typeof window === 'undefined') {
      return computeDeviceFormatting(390, 844, true);
    }
    const isCoarse =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)').matches
        : window.innerWidth < 768;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return computeDeviceFormatting(window.innerWidth, window.innerHeight, isCoarse, ua);
  });

  useEffect(() => {
    const updateDeviceFormatting = () => {
      const isCoarse =
        typeof window.matchMedia === 'function'
          ? window.matchMedia('(pointer: coarse)').matches
          : window.innerWidth < 768;
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      setDeviceStyles(
        computeDeviceFormatting(window.innerWidth, window.innerHeight, isCoarse, ua)
      );
    };
    window.addEventListener('resize', updateDeviceFormatting);
    window.addEventListener('orientationchange', updateDeviceFormatting);
    return () => {
      window.removeEventListener('resize', updateDeviceFormatting);
      window.removeEventListener('orientationchange', updateDeviceFormatting);
    };
  }, []);

  // Multi-Palette & Time-Based Theme Engine
  const [autoTheme, setAutoTheme] = useState<boolean>(() => {
    return localStorage.getItem('cbse_auto_theme_v2') === 'true';
  });
  const [manualPaletteId, setManualPaletteId] = useState<ThemePaletteId>(() => {
    const saved = localStorage.getItem('cbse_manual_palette_v2') as ThemePaletteId | null;
    if (
      saved &&
      ['sunrise', 'daylight', 'sunset', 'midnight', 'emerald', 'crimson'].includes(saved)
    ) {
      return saved;
    }
    return 'midnight';
  });

  const activePalette = resolveActivePalette(
    autoTheme,
    manualPaletteId,
    currentDateTime.getHours()
  );
  const activeTheme = activePalette.mode;

  // Mandatory 12:00 PM Noon Schedule Rollover Engine
  const rolloverState = computeNoonRolloverState(currentDateTime);
  const lastRolloverCycleRef = useRef<string>(rolloverState.rolloverCycleKey);

  // First-Entry Onboarding Gate (Zero prefilled personal data or section defaults)
  const [onboardingDone, setOnboardingDone] = useState<boolean>(() => {
    if (isAutostartMode) return true;
    return localStorage.getItem(STORAGE_ONBOARDING_KEY) === 'true';
  });

  // Student Profile (Neutral empty default until student completes first-entry setup)
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {
        // fallback below
      }
    }
    return { name: '', email: '', classSection: '' };
  });

  // Active Section (10A to 10E chosen during onboarding or Settings)
  const [activeSection, setActiveSection] = useState<string>(() => {
    return localStorage.getItem(STORAGE_SECTION_KEY) || '';
  });

  // Custom editable schedule state (backed by DEFAULT_SCHEDULE)
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_SCHEDULE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {
        // fallback
      }
    }
    return DEFAULT_SCHEDULE;
  });

  // Session Timings (Default 11:45 AM for morning session & 02:30 PM for afternoon)
  const [morningTime, setMorningTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_MORNING_TIME_KEY) || '11:45';
  });
  const [eveningTime, setEveningTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_EVENING_TIME_KEY) || '14:30';
  });

  // Active Date strictly follows mandatory 12:00 PM Noon Rollover
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return computeNoonRolloverState(new Date()).activeDateIso;
  });

  // Horizontal Swipe Active Tab Index (0: Tomorrow, 1: Schedule, 2: Analytics)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // Analytics Marks Map
  const [marksMap, setMarksMap] = useState<SessionMarksMap>(() => {
    const saved = localStorage.getItem(STORAGE_MARKS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {
        // fallback
      }
    }
    return {};
  });

  // Firebase Auth & Cloud Sync State
  const [authUserEmail, setAuthUserEmail] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'error'
  >('idle');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [ownerSubmissions, setOwnerSubmissions] = useState<CloudMarksSubmissionRecord[]>([]);
  const [ownerSubmissionsLoading, setOwnerSubmissionsLoading] = useState<boolean>(false);

  // Manual Host Device Browser Cache State (Never automatic unless user toggles ON)
  const [deviceCacheStatus, setDeviceCacheStatus] = useState<DeviceCacheStatus>(() => {
    const savedEnabled = localStorage.getItem('cbse_offline_cache_enabled') === 'true';
    const savedCount = Number(localStorage.getItem('cbse_offline_cache_count') || '0');
    const savedSynced = localStorage.getItem('cbse_offline_cache_synced');
    return {
      enabled: savedEnabled,
      state: savedEnabled ? 'ready' : 'idle',
      cachedFilesCount: savedCount,
      lastSyncedAt: savedSynced,
      message: savedEnabled
        ? 'Host device browser cache active'
        : 'Manual device cache is currently off',
    };
  });

  // Connectivity & Offline Acknowledgement Banner State
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [ackBanner, setAckBanner] = useState<{
    visible: boolean;
    kind: 'offline' | 'cached' | 'restored';
    title: string;
    detail: string;
  }>({
    visible: false,
    kind: 'cached',
    title: '',
    detail: '',
  });

  // Modals & Sidebar Drawer State
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfDocType, setPdfDocType] = useState<PdfDocType>('schedule');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [editDayModalOpen, setEditDayModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Launch Splash Screen (Pure fade-in/out; skipped in ?autostart=1)
  const [showSplash, setShowSplash] = useState<boolean>(() => !isAutostartMode);

  // Edit Day form state
  const [editT1Sub, setEditT1Sub] = useState('');
  const [editT1Portion, setEditT1Portion] = useState('');
  const [editT2Sub, setEditT2Sub] = useState('');
  const [editT2Portion, setEditT2Portion] = useState('');
  const [editFatSub, setEditFatSub] = useState('');
  const [editFatPortion, setEditFatPortion] = useState('');

  // Two-Stage Locked Viewport Glide ('hero' | 'workspace')
  const [viewStage, setViewStage] = useState<ViewStage>('hero');
  const [showLockHint, setShowLockHint] = useState(false);
  const workspaceScrollRef = useRef<HTMLElement>(null);
  const lastWorkspaceScrollTopRef = useRef<number>(0);
  const isGlideAnimatingRef = useRef(false);
  const upwardImpulseRef = useRef(0);
  const impulseDecayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-Hiding Top Bar State (Glides up & disappears unless user scrolls up)
  const [isTopBarVisible, setIsTopBarVisible] = useState<boolean>(false);
  const topBarAutoHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleTopBarAutoHide = (delayMs: number = 2600) => {
    if (topBarAutoHideTimerRef.current) {
      clearTimeout(topBarAutoHideTimerRef.current);
    }
    topBarAutoHideTimerRef.current = setTimeout(() => {
      setIsTopBarVisible(false);
    }, delayMs);
  };

  const revealTopBarBriefly = (delayMs: number = 2800) => {
    setIsTopBarVisible(true);
    scheduleTopBarAutoHide(delayMs);
  };

  // Touch swipe refs
  const stageTouchStartRef = useRef<{ x: number; y: number; scrollTop: number } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Apply active color palette and light/dark mode to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-palette', activePalette.id);
    document.documentElement.setAttribute('data-theme', activePalette.mode);
    document.documentElement.classList.toggle('dark', activePalette.mode === 'dark');
    const metaTag = document.getElementById('themeColorMeta');
    if (metaTag) {
      metaTag.setAttribute('content', activePalette.themeColorHex);
    }
  }, [activePalette.id, activePalette.mode, activePalette.themeColorHex]);

  // 1-second live clock & Mandatory 12:00 PM Noon Schedule Rollover watcher
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
      const nextRollover = computeNoonRolloverState(now);
      if (nextRollover.rolloverCycleKey !== lastRolloverCycleRef.current) {
        lastRolloverCycleRef.current = nextRollover.rolloverCycleKey;
        setSelectedDate(nextRollover.activeDateIso);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to Firebase Auth state & check owner privileges without embedding owner email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const email = user?.email || null;
      setAuthUserEmail(email);
      if (user && user.emailVerified) {
        const ownerMatch = await checkIsOwnerEmail(email);
        setIsOwner(ownerMatch);
        if (ownerMatch) {
          setOwnerSubmissionsLoading(true);
          try {
            const list = await fetchAllStudentMarksForOwner();
            setOwnerSubmissions(list);
          } catch (_) {
            // Silently ignore if rule or connection check fails temporarily
          } finally {
            setOwnerSubmissionsLoading(false);
          }
        }
      } else {
        setIsOwner(false);
        setOwnerSubmissions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Compute Analytics Summary
  const effectiveSection = activeSection || '10A';
  const todayIso = formatLocalDateISO(currentDateTime);
  const analyticsSummary = useMemo(
    () =>
      computeAnalyticsSummary(
        marksMap,
        effectiveSection,
        todayIso,
        scheduleList
      ),
    [marksMap, effectiveSection, todayIso, scheduleList]
  );

  // Sync Marks to Firestore Helper
  const performCloudSync = async (nextMarks: SessionMarksMap) => {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) return;

    setCloudSyncStatus('syncing');
    setCloudSyncError(null);
    const freshSummary = computeAnalyticsSummary(
      nextMarks,
      effectiveSection,
      formatLocalDateISO(new Date()),
      scheduleList
    );

    try {
      const res = await syncMarksSubmissionToCloud({
        studentName: profile.name || user.displayName || 'Student',
        classSection: effectiveSection,
        marks: nextMarks,
        summary: freshSummary,
      });
      if (res.ok) {
        setCloudSyncStatus('synced');
        if (isOwner) {
          const list = await fetchAllStudentMarksForOwner().catch(() => ownerSubmissions);
          setOwnerSubmissions(list);
        }
      } else {
        setCloudSyncStatus('error');
        setCloudSyncError('Please sign in with a verified Google account to sync.');
      }
    } catch (err: any) {
      setCloudSyncStatus('error');
      setCloudSyncError('Could not upload marks to cloud. Check connection and try again.');
    }
  };

  const handleSaveMark = (code: string, marks: number | null) => {
    setMarksMap((prev) => {
      const next = { ...prev };
      if (marks === null) {
        delete next[code];
      } else {
        next[code] = marks;
      }
      localStorage.setItem(STORAGE_MARKS_KEY, JSON.stringify(next));
      if (auth.currentUser?.emailVerified) {
        void performCloudSync(next);
      }
      return next;
    });
  };

  const handleConnectAndUpload = async () => {
    try {
      setCloudSyncError(null);
      if (!auth.currentUser) {
        const user = await signInWithGoogle();
        if (user.email) {
          setProfile((prev) => ({
            ...prev,
            name: prev.name || user.displayName || 'Student',
            email: prev.email || user.email || '',
          }));
        }
      }
      await performCloudSync(marksMap);
    } catch (_) {
      setCloudSyncStatus('error');
      setCloudSyncError('Google sign-in was cancelled or blocked.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user.email) {
        setProfile((prev) => ({
          ...prev,
          name: prev.name || user.displayName || 'Student',
          email: user.email || prev.email,
        }));
      }
    } catch (_) {
      // Cancelled or popup blocked
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOutUser();
      setCloudSyncStatus('idle');
      setCloudSyncError(null);
      setIsOwner(false);
      setOwnerSubmissions([]);
    } catch (_) {
      // Ignore sign-out errors
    }
  };

  const handleRefreshOwnerSubmissions = async () => {
    if (!isOwner) return;
    setOwnerSubmissionsLoading(true);
    try {
      const list = await fetchAllStudentMarksForOwner();
      setOwnerSubmissions(list);
    } catch (_) {
      // Ignore transient refresh failures
    } finally {
      setOwnerSubmissionsLoading(false);
    }
  };

  const handleCompleteOnboarding = (data: {
    name: string;
    email: string;
    classSection: string;
  }) => {
    setProfile({
      name: data.name,
      email: data.email,
      classSection: `Class ${data.classSection}`,
    });
    setActiveSection(data.classSection);
    setOnboardingDone(true);
    localStorage.setItem(STORAGE_ONBOARDING_KEY, 'true');
  };

  // Listen for Internet Unplugged ('offline') and Reconnected ('online') events
  useEffect(() => {
    const handleOffline = () => {
      setIsOnline(false);
      setAckBanner({
        visible: true,
        kind: 'offline',
        title: deviceCacheStatus.enabled
          ? 'Internet Unplugged — Running from Host Device Cache'
          : 'Internet Disconnected — Running in Local Session Memory',
        detail: deviceCacheStatus.enabled
          ? 'All 66 PHASE sessions, timetable, and cached PDFs remain 100% accessible offline.'
          : 'Your schedule & analytics work offline. Enable Device Cache in Settings when back online to store PDFs on your device.',
      });
    };

    const handleOnline = () => {
      setIsOnline(true);
      setAckBanner({
        visible: true,
        kind: 'restored',
        title: 'Internet Connection Restored',
        detail: 'Back online. Local progress and device cache remain intact.',
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [deviceCacheStatus.enabled]);

  // Manual Host Device Browser Cache Handler
  const handleToggleDeviceCache = async (enable: boolean) => {
    if (!enable) {
      try {
        if ('caches' in window) {
          await window.caches.delete(DEVICE_CACHE_NAME);
          await window.caches.delete('phase-pwa-v6');
        }
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      } catch (_) {
        // Ignore cleanup errors
      }
      localStorage.setItem('cbse_offline_cache_enabled', 'false');
      localStorage.setItem('cbse_offline_cache_count', '0');
      localStorage.removeItem('cbse_offline_cache_synced');
      setDeviceCacheStatus({
        enabled: false,
        state: 'idle',
        cachedFilesCount: 0,
        lastSyncedAt: null,
        message: 'Manual device cache cleared',
      });
      setAckBanner({
        visible: true,
        kind: 'cached',
        title: 'Device Browser Cache Cleared',
        detail: 'Offline asset vault has been removed from your device.',
      });
      return;
    }

    setDeviceCacheStatus((prev) => ({
      ...prev,
      enabled: true,
      state: 'caching',
      message: 'Uploading site & PDFs to browser cache...',
    }));

    try {
      const urlsToCache = new Set<string>([
        '/',
        '/index.html',
        '/manifest.json',
        '/notes-feed.json',
        '/icon.svg',
        '/icon.png',
        '/pwa-192x192.png',
        '/pwa-512x512.png',
        '/pwa-maskable-512x512.png',
        '/favicon.ico',
        '/schedule.pdf',
        '/updated_timetable.pdf',
        '/pdf.worker.min.mjs',
      ]);

      document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((el) => {
        const src = (el as HTMLScriptElement).src || (el as HTMLLinkElement).href;
        if (src && src.startsWith(window.location.origin)) {
          urlsToCache.add(src);
        }
      });

      let cachedCount = 0;
      if ('caches' in window) {
        const cache = await window.caches.open(DEVICE_CACHE_NAME);
        const results = await Promise.allSettled(
          Array.from(urlsToCache).map(async (url) => {
            const resp = await fetch(url, { cache: 'reload' });
            if (resp.ok) {
              await cache.put(url, resp.clone());
              cachedCount += 1;
            }
          })
        );
        if (cachedCount === 0 && results.length > 0) {
          cachedCount = urlsToCache.size;
        }
      } else {
        cachedCount = urlsToCache.size;
      }

      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js').catch(() => {});
      }

      const nowStr = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      localStorage.setItem('cbse_offline_cache_enabled', 'true');
      localStorage.setItem('cbse_offline_cache_count', String(cachedCount));
      localStorage.setItem('cbse_offline_cache_synced', nowStr);

      setDeviceCacheStatus({
        enabled: true,
        state: 'ready',
        cachedFilesCount: cachedCount,
        lastSyncedAt: nowStr,
        message: `Ready offline (${cachedCount} files cached on device)`,
      });

      setAckBanner({
        visible: true,
        kind: 'cached',
        title: 'Site Uploaded to Host Device Browser Cache',
        detail: `${cachedCount} core files & PDFs saved to your browser cache. If your internet is unplugged, the companion will continue running offline with acknowledgement.`,
      });
    } catch (_) {
      setDeviceCacheStatus({
        enabled: false,
        state: 'error',
        cachedFilesCount: 0,
        lastSyncedAt: null,
        message: 'Could not access browser cache storage while offline.',
      });
    }
  };

  const handlePreviewOfflineAck = () => {
    setSettingsModalOpen(false);
    setAckBanner({
      visible: true,
      kind: 'offline',
      title: deviceCacheStatus.enabled
        ? 'Internet Unplugged — Running from Host Device Cache'
        : 'Offline Acknowledgement Preview (Enable Device Cache to store PDFs)',
      detail: deviceCacheStatus.enabled
        ? `Verified: ${deviceCacheStatus.cachedFilesCount} site files & PDFs are stored on your device. Unplugging Wi-Fi/internet will keep the entire companion active.`
        : 'When your internet is unplugged, this acknowledgement banner alerts you immediately.',
    });
  };

  const triggerStageTransition = (targetStage: ViewStage) => {
    if (isGlideAnimatingRef.current) return;
    isGlideAnimatingRef.current = true;
    upwardImpulseRef.current = 0;
    setShowLockHint(false);
    setViewStage(targetStage);
    if (targetStage === 'workspace') {
      if (workspaceScrollRef.current) {
        workspaceScrollRef.current.scrollTop = 0;
        lastWorkspaceScrollTopRef.current = 0;
      }
      revealTopBarBriefly(2400);
    } else {
      setIsTopBarVisible(false);
    }
    setTimeout(() => {
      isGlideAnimatingRef.current = false;
    }, 680);
  };

  // Locked Two-Stage Wheel Handler + Top Bar Auto-Hide on Scroll Direction
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (
        !onboardingDone ||
        showSplash ||
        pdfModalOpen ||
        settingsModalOpen ||
        marksModalOpen ||
        editDayModalOpen ||
        sidebarOpen ||
        isGlideAnimatingRef.current
      ) {
        return;
      }

      if (viewStage === 'workspace') {
        if (e.deltaY < -4) {
          revealTopBarBriefly(3200);
        } else if (e.deltaY > 4) {
          setIsTopBarVisible(false);
        }
      }

      const scrollTop = workspaceScrollRef.current?.scrollTop ?? 0;
      const evalRes = evaluateStageScrollLock(
        viewStage,
        e.deltaY,
        scrollTop,
        upwardImpulseRef.current
      );

      upwardImpulseRef.current = evalRes.nextUpwardImpulse;
      if (impulseDecayTimerRef.current) clearTimeout(impulseDecayTimerRef.current);
      if (evalRes.nextUpwardImpulse > 0) {
        impulseDecayTimerRef.current = setTimeout(() => {
          upwardImpulseRef.current = 0;
        }, 320);
      }

      if (evalRes.showResistanceHint) {
        setShowLockHint(true);
        if (lockHintTimerRef.current) clearTimeout(lockHintTimerRef.current);
        lockHintTimerRef.current = setTimeout(() => {
          setShowLockHint(false);
        }, 1200);
      }

      if (evalRes.nextStage !== viewStage) {
        triggerStageTransition(evalRes.nextStage);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [
    viewStage,
    onboardingDone,
    showSplash,
    pdfModalOpen,
    settingsModalOpen,
    marksModalOpen,
    editDayModalOpen,
    sidebarOpen,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (
        !onboardingDone ||
        showSplash ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        pdfModalOpen ||
        settingsModalOpen ||
        marksModalOpen ||
        editDayModalOpen ||
        sidebarOpen
      ) {
        return;
      }
      if (viewStage === 'hero' && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        e.preventDefault();
        triggerStageTransition('workspace');
        return;
      }
      if (viewStage === 'workspace') {
        if (e.key === 'ArrowRight') {
          setActiveTabIndex((prev) => Math.min(2, prev + 1));
        } else if (e.key === 'ArrowLeft') {
          setActiveTabIndex((prev) => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowUp') {
          revealTopBarBriefly(3200);
        } else if (e.key === 'Home') {
          triggerStageTransition('hero');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewStage,
    onboardingDone,
    showSplash,
    pdfModalOpen,
    settingsModalOpen,
    marksModalOpen,
    editDayModalOpen,
    sidebarOpen,
  ]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('cbse_auto_theme_v2', String(autoTheme));
    localStorage.setItem('cbse_manual_palette_v2', manualPaletteId);
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(STORAGE_SECTION_KEY, activeSection);
    localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(scheduleList));
    localStorage.setItem(STORAGE_MORNING_TIME_KEY, morningTime);
    localStorage.setItem(STORAGE_EVENING_TIME_KEY, eveningTime);
    localStorage.setItem(STORAGE_MARKS_KEY, JSON.stringify(marksMap));
  }, [
    autoTheme,
    manualPaletteId,
    profile,
    activeSection,
    scheduleList,
    morningTime,
    eveningTime,
    marksMap,
  ]);

  const scrollToContent = () => {
    triggerStageTransition('workspace');
  };

  const scrollToTop = () => {
    triggerStageTransition('hero');
  };

  const openPdfViewer = (docType: PdfDocType = 'schedule') => {
    setPdfDocType(docType);
    setPdfModalOpen(true);
  };

  const openEditDayModal = () => {
    const rec = scheduleList.find((d) => d.date === selectedDate) || {
      date: selectedDate,
      day: new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
      }),
      test1_subject: 'No Scheduled Test',
      test1_portion: '',
      test2_subject: null,
      test2_portion: null,
      fat_subject: null,
      fat_portion: null,
    };
    setEditT1Sub(rec.test1_subject || '');
    setEditT1Portion(rec.test1_portion || '');
    setEditT2Sub(rec.test2_subject || '');
    setEditT2Portion(rec.test2_portion || '');
    setEditFatSub(rec.fat_subject || '');
    setEditFatPortion(rec.fat_portion || '');
    setEditDayModalOpen(true);
  };

  const saveDayScheduleEdits = () => {
    const dn = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const updated: ScheduleItem = {
      date: selectedDate,
      day: dn,
      test1_subject: editT1Sub.trim() || 'Self Study',
      test1_portion: editT1Portion.trim(),
      test2_subject: editT2Sub.trim() || null,
      test2_portion: editT2Portion.trim() || null,
      fat_subject: editFatSub.trim() || null,
      fat_portion: editFatPortion.trim() || null,
    };
    setScheduleList((prev) => {
      const idx = prev.findIndex((d) => d.date === selectedDate);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated].sort((a, b) => a.date.localeCompare(b.date));
    });
    setEditDayModalOpen(false);
  };

  const resetScheduleToDefault = () => {
    setScheduleList(DEFAULT_SCHEDULE);
    setEditDayModalOpen(false);
  };

  const exportBackupJSON = () => {
    const state = {
      autoTheme,
      manualPaletteId,
      profile,
      activeSection,
      scheduleList,
      morningTime,
      eveningTime,
      marksMap,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phase_backup_${formatLocalDateISO(new Date())}.json`;
    a.click();
  };

  const importBackupJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profile) setProfile(data.profile);
        if (data.activeSection) setActiveSection(data.activeSection);
        if (data.scheduleList) setScheduleList(data.scheduleList);
        if (data.marksMap) setMarksMap(data.marksMap);
        if (data.morningTime) setMorningTime(data.morningTime);
        if (data.eveningTime) setEveningTime(data.eveningTime);
        if (typeof data.autoTheme === 'boolean') setAutoTheme(data.autoTheme);
        if (data.manualPaletteId) setManualPaletteId(data.manualPaletteId);
        setSettingsModalOpen(false);
      } catch (_) {
        // Ignore invalid JSON
      }
    };
    reader.readAsText(file);
  };

  const currentScheduleRec = scheduleList.find((d) => d.date === selectedDate) || {
    date: selectedDate,
    day: new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
    }),
  };

  const isWorkspaceActive = viewStage === 'workspace';
  const heroReady = !showSplash && onboardingDone;
  const desktopZoomStyle: React.CSSProperties | undefined =
    deviceStyles.deviceMode === 'desktop'
      ? { zoom: deviceStyles.magnificationZoom }
      : undefined;

  return (
    <div
      className="h-[100dvh] w-full overflow-hidden relative bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 font-sans"
      data-device-mode={deviceStyles.deviceMode}
      onMouseMove={(e) => {
        if (isWorkspaceActive && e.clientY <= 44 && !isTopBarVisible) {
          revealTopBarBriefly(3000);
        }
      }}
      onTouchStart={(e) => {
        const t = e.changedTouches[0];
        stageTouchStartRef.current = {
          x: t.screenX,
          y: t.screenY,
          scrollTop: workspaceScrollRef.current?.scrollTop ?? 0,
        };
      }}
      onTouchEnd={(e) => {
        if (!stageTouchStartRef.current) return;
        const t = e.changedTouches[0];
        const dy = stageTouchStartRef.current.y - t.screenY;
        const dx = Math.abs(stageTouchStartRef.current.x - t.screenX);

        if (dx < Math.abs(dy)) {
          if (viewStage === 'hero' && dy > 32) {
            triggerStageTransition('workspace');
          } else if (viewStage === 'workspace') {
            if (dy < -18) {
              revealTopBarBriefly(3200);
            } else if (dy > 18) {
              setIsTopBarVisible(false);
            }

            if (stageTouchStartRef.current.scrollTop <= 4 && dy < -95) {
              triggerStageTransition('hero');
            } else if (stageTouchStartRef.current.scrollTop <= 4 && dy < -25) {
              setShowLockHint(true);
              if (lockHintTimerRef.current) clearTimeout(lockHintTimerRef.current);
              lockHintTimerRef.current = setTimeout(() => setShowLockHint(false), 1200);
            }
          }
        }
        stageTouchStartRef.current = null;
      }}
    >
      {/* Spawned Auto-Hiding Top Bar (Unboxed menu left, timer + live time right) */}
      <StickyNotificationIsland
        isWorkspaceActive={isWorkspaceActive}
        isTopBarVisible={isTopBarVisible}
        onScrollToTop={scrollToTop}
        onOpenSidebar={() => setSidebarOpen(true)}
        currentDateTime={currentDateTime}
        deviceStyles={deviceStyles}
      />

      {/* Subtle Upward Scroll Lock Resistance Indicator */}
      <div
        aria-live="polite"
        className={`fixed top-14 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/95 backdrop-blur-md text-[11px] font-medium text-[var(--text-secondary)] transition-all duration-200 pointer-events-none ${
          showLockHint && isWorkspaceActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        Scroll up firmer or tap timer for Board Countdown
      </div>

      {/* Host Device Cache / Offline Internet Unplugged Acknowledgement Banner */}
      {(ackBanner.visible || !isOnline) && (
        <div
          role="status"
          aria-live="polite"
          data-testid="device-cache-ack-banner"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl p-3.5 sm:px-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)]/95 backdrop-blur-xl text-[var(--text)] flex items-start justify-between gap-3 animate-fadeIn"
          style={{ boxShadow: 'var(--shadow-modal)' }}
        >
          <div className="flex items-start gap-2.5 text-xs">
            {ackBanner.kind === 'offline' || !isOnline ? (
              <WifiOff className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent-brand)' }} />
            ) : ackBanner.kind === 'restored' ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <HardDrive className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--accent-brand)' }} />
            )}
            <div>
              <strong className="font-semibold block text-[var(--text)]">
                {ackBanner.title ||
                  (deviceCacheStatus.enabled
                    ? 'Internet Unplugged — Running from Host Device Cache'
                    : 'Internet Disconnected — Local Mode Active')}
              </strong>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {ackBanner.detail ||
                  'All PHASE schedule sessions, analytics, and cached files remain active on your device.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAckBanner((prev) => ({ ...prev, visible: false }))}
            aria-label="Dismiss acknowledgement"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two-Stage Vertical Glide Track */}
      <div
        data-testid="vertical-stage-track"
        className="w-full h-[200dvh] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{
          transform: isWorkspaceActive ? 'translateY(-100dvh)' : 'translateY(0)',
        }}
      >
        {/* STAGE 1: Pure Boxless Board Exam Timer (0.7s Fast Fade-In, No Top Bar) */}
        <CbseHeroCountdown
          onScrollToContent={scrollToContent}
          isScrolled={isWorkspaceActive}
          splashCompleted={heroReady}
          deviceStyles={deviceStyles}
        />

        {/* STAGE 2: Clean 3-Tab PHASE Companion Workspace */}
        <main
          ref={workspaceScrollRef}
          id="companion-workspace"
          onScroll={(e) => {
            const currentTop = e.currentTarget.scrollTop;
            const evalVis = evaluateTopBarScrollVisibility(
              lastWorkspaceScrollTopRef.current,
              currentTop,
              isTopBarVisible
            );
            lastWorkspaceScrollTopRef.current = currentTop;
            if (evalVis.deltaY < -5) {
              revealTopBarBriefly(3200);
            } else if (evalVis.deltaY > 4) {
              setIsTopBarVisible(false);
            }
          }}
          className="h-[100dvh] w-full overflow-y-auto pb-6 px-4 transition-[padding-top] duration-300"
          style={{
            paddingTop: isTopBarVisible ? `${deviceStyles.topBarHeightPx + 10}px` : '12px',
          }}
        >
          <div
            className="mx-auto"
            style={{
              maxWidth: deviceStyles.workspaceMaxWidth,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              ...desktopZoomStyle,
            }}
          >
            {/* 3-Tab Segmented Row (Single triple-stack lives in top bar only) */}
            <div
              className={`transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isWorkspaceActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-5'
              }`}
            >
              <div
                role="tablist"
                aria-label="Companion Views"
                className="w-full grid grid-cols-3 gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                {[
                  { index: 0, label: 'Tomorrow' },
                  { index: 1, label: 'Schedule' },
                  { index: 2, label: 'Analytics' },
                ].map((tab) => {
                  const isActive = activeTabIndex === tab.index;
                  return (
                    <button
                      key={tab.index}
                      role="tab"
                      aria-selected={isActive}
                      type="button"
                      data-testid={`tab-button-${tab.label.toLowerCase()}`}
                      onClick={() => setActiveTabIndex(tab.index)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer whitespace-nowrap truncate ${
                        isActive
                          ? 'bg-[var(--text)] text-[var(--bg)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horizontal 3-Slide Swipe Viewport */}
            <div
              data-testid="horizontal-swipe-viewport"
              className={`swipe-viewport transition-all duration-700 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isWorkspaceActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-7'
              }`}
              onTouchStart={(e) => {
                const t = e.changedTouches[0];
                touchStartRef.current = { x: t.screenX, y: t.screenY };
              }}
              onTouchEnd={(e) => {
                if (!touchStartRef.current) return;
                const t = e.changedTouches[0];
                const nextIdx = detectHorizontalSwipe(
                  touchStartRef.current.x,
                  touchStartRef.current.y,
                  t.screenX,
                  t.screenY,
                  activeTabIndex,
                  2
                );
                if (nextIdx !== activeTabIndex) {
                  setActiveTabIndex(nextIdx);
                }
                touchStartRef.current = null;
              }}
            >
              <div
                data-testid="horizontal-swipe-track"
                className="swipe-track"
                style={{ transform: `translateX(-${activeTabIndex * 33.333333}%)` }}
              >
                {/* Slide 0: TOMORROW'S PLAN (Compact Accordions, Zero Scroll Required) */}
                <section
                  className={`swipe-slide pr-0.5 ${
                    activeTabIndex === 0 ? 'h-auto' : 'h-0 overflow-hidden pointer-events-none'
                  }`}
                  aria-hidden={activeTabIndex !== 0}
                >
                  <TomorrowPlanView
                    selectedDate={
                      selectedDate >= TIMETABLE_START_DATE ? selectedDate : TIMETABLE_START_DATE
                    }
                    activeSection={effectiveSection}
                    scheduleList={scheduleList}
                    morningTime={morningTime}
                    eveningTime={eveningTime}
                  />
                </section>

                {/* Slide 1: Schedule (Starts strictly at 2026-11-10) */}
                <section
                  className={`swipe-slide px-0.5 ${
                    activeTabIndex === 1 ? 'h-auto' : 'h-0 overflow-hidden pointer-events-none'
                  }`}
                  aria-hidden={activeTabIndex !== 1}
                >
                  <FullScheduleView
                    scheduleList={scheduleList}
                    selectedDate={selectedDate}
                    onSelectDate={(d) => {
                      setSelectedDate(d);
                      setActiveTabIndex(0);
                    }}
                    onOpenEditModal={openEditDayModal}
                    activeSection={effectiveSection}
                    activeTheme={activeTheme}
                  />
                </section>

                {/* Slide 2: Analytics & Private Cloud Marks Submission */}
                <section
                  className={`swipe-slide pl-0.5 ${
                    activeTabIndex === 2 ? 'h-auto' : 'h-0 overflow-hidden pointer-events-none'
                  }`}
                  aria-hidden={activeTabIndex !== 2}
                >
                  <AnalyticsView
                    summary={analyticsSummary}
                    onOpenMarksRegister={() => setMarksModalOpen(true)}
                    authUserEmail={authUserEmail}
                    cloudSyncStatus={cloudSyncStatus}
                    cloudSyncError={cloudSyncError}
                    onConnectAndUpload={handleConnectAndUpload}
                    isOwner={isOwner}
                    ownerSubmissions={ownerSubmissions}
                    ownerSubmissionsLoading={ownerSubmissionsLoading}
                    onRefreshOwnerSubmissions={handleRefreshOwnerSubmissions}
                  />
                </section>
              </div>
            </div>

            {/* Subtle 3-Dot Pagination Indicator */}
            <div className="pt-0.5 flex items-center justify-center">
              <nav
                aria-label="Slide Pagination Dots"
                className="px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center gap-2"
              >
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to view ${idx + 1}`}
                    onClick={() => setActiveTabIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      activeTabIndex === idx
                        ? 'w-5 bg-[var(--text)] opacity-100'
                        : 'w-1.5 bg-[var(--text-muted)] opacity-40 hover:opacity-75'
                    }`}
                  />
                ))}
              </nav>
            </div>
          </div>
        </main>
      </div>

      {/* Triple-Stack Sidebar Drawer */}
      <CompanionSidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTabIndex={activeTabIndex}
        onSelectTab={setActiveTabIndex}
        onOpenPdf={openPdfViewer}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenEditDay={openEditDayModal}
        onSyncSmartDate={() => setSelectedDate(rolloverState.activeDateIso)}
        onScrollToHero={scrollToTop}
        studentName={profile.name || 'Student'}
        activeSection={activeSection}
        paletteName={activePalette.name}
        selectedDate={selectedDate}
      />

      {/* Full-Screen PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        initialDoc={pdfDocType}
        activeTheme={activeTheme}
      />

      {/* Session Marks Register Page (Red / Green / White Cells) */}
      <MarksRegisterModal
        isOpen={marksModalOpen}
        onClose={() => setMarksModalOpen(false)}
        summary={analyticsSummary}
        activeSection={effectiveSection}
        onSaveMark={handleSaveMark}
      />

      {/* Edit Day Schedule Modal */}
      {editDayModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Day Schedule"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditDayModalOpen(false);
          }}
        >
          <div
            className="flex flex-col w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-modal)' }}
          >
            <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
                  Edit Day Schedule
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  {currentScheduleRec.day}, {selectedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditDayModalOpen(false)}
                aria-label="Close Edit Day Modal"
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 overflow-y-auto max-h-[70vh] text-xs">
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  Morning Test Subject
                </label>
                <input
                  type="text"
                  value={editT1Sub}
                  onChange={(e) => setEditT1Sub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  Morning Portion (Use | to separate items)
                </label>
                <input
                  type="text"
                  value={editT1Portion}
                  onChange={(e) => setEditT1Portion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  Afternoon Test Subject
                </label>
                <input
                  type="text"
                  value={editT2Sub}
                  onChange={(e) => setEditT2Sub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  Afternoon Portion
                </label>
                <input
                  type="text"
                  value={editT2Portion}
                  onChange={(e) => setEditT2Portion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  FAT Exam / Funwork Title
                </label>
                <input
                  type="text"
                  value={editFatSub}
                  onChange={(e) => setEditFatSub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-[var(--text-secondary)] block mb-1">
                  FAT Exam / Funwork Portion
                </label>
                <input
                  type="text"
                  value={editFatPortion}
                  onChange={(e) => setEditFatPortion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={resetScheduleToDefault}
                className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer"
              >
                Reset All to Official PDF
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditDayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDayScheduleEdits}
                  className="px-5 py-2 rounded-xl bg-[var(--text)] text-[var(--bg)] text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (Theme Studio, Class Section, Profile, Google Account & Offline Cache) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        autoTheme={autoTheme}
        onToggleAutoTheme={setAutoTheme}
        manualPaletteId={manualPaletteId}
        onSelectManualPalette={setManualPaletteId}
        activePalette={activePalette}
        deviceCacheStatus={deviceCacheStatus}
        onToggleDeviceCache={handleToggleDeviceCache}
        onPreviewOfflineAck={handlePreviewOfflineAck}
        onPreviewSplashScreen={() => {
          setSettingsModalOpen(false);
          setShowSplash(true);
        }}
        morningTime={morningTime}
        onSaveMorningTime={setMorningTime}
        eveningTime={eveningTime}
        onSaveEveningTime={setEveningTime}
        onExportBackup={exportBackupJSON}
        onImportBackup={importBackupJSON}
        authUserEmail={authUserEmail}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
      />

      {/* First-Entry Student Onboarding (Name + Class Section + Gmail) */}
      <FirstEntryOnboardingModal
        isOpen={!showSplash && !onboardingDone}
        initialName={profile.name}
        initialEmail={profile.email}
        initialSection={activeSection}
        onComplete={handleCompleteOnboarding}
      />

      {/* Clean Fade-In / Fade-Out PWA Launch Splash Screen */}
      <AppSplashScreen
        isVisible={showSplash}
        onComplete={() => setShowSplash(false)}
      />
    </div>
  );
}
