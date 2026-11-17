import {
  ScheduleItem,
  SectionDailySession,
  SessionMarksMap,
  SubjectSessionCell,
  SubjectAnalyticsSummary,
  OverallAnalyticsSummary,
} from '../types';
import {
  CBSE_2027_EXAM_CONFIG,
  SUBJECT_CODES_MAP,
  FAT_EXAMS_MAP,
  DAILY_FUNWORK_MAP,
  SECTION_TIMETABLE_DATA,
  DEFAULT_SCHEDULE,
} from '../data/scheduleData';

export const TIMETABLE_START_DATE = '2026-11-10';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export type ThemePaletteId =
  | 'sunrise'
  | 'daylight'
  | 'sunset'
  | 'midnight'
  | 'emerald'
  | 'crimson';

export interface ThemePaletteMeta {
  id: ThemePaletteId;
  name: string;
  subtitle: string;
  timeWindowLabel: string;
  mode: 'light' | 'dark';
  swatchBg: string;
  swatchSurface: string;
  swatchAccent: string;
  themeColorHex: string;
}

export const THEME_PALETTES: ThemePaletteMeta[] = [
  {
    id: 'sunrise',
    name: 'Dawn Ivory',
    subtitle: 'Warm sunlit paper & amber ink',
    timeWindowLabel: '05:00 AM – 11:59 AM',
    mode: 'light',
    swatchBg: '#FAF6F0',
    swatchSurface: '#FFFFFF',
    swatchAccent: '#D97706',
    themeColorHex: '#FAF6F0',
  },
  {
    id: 'daylight',
    name: 'Ceramic Daylight',
    subtitle: 'Crisp porcelain & royal cobalt',
    timeWindowLabel: '12:00 PM – 04:59 PM',
    mode: 'light',
    swatchBg: '#F3F6FB',
    swatchSurface: '#FFFFFF',
    swatchAccent: '#2563EB',
    themeColorHex: '#F3F6FB',
  },
  {
    id: 'sunset',
    name: 'Dusk Horizon',
    subtitle: 'Twilight plum-slate & warm gold',
    timeWindowLabel: '05:00 PM – 08:59 PM',
    mode: 'dark',
    swatchBg: '#110E1A',
    swatchSurface: '#191526',
    swatchAccent: '#F59E0B',
    themeColorHex: '#110E1A',
  },
  {
    id: 'midnight',
    name: 'Obsidian Nocturne',
    subtitle: 'Deep carbon & electric sky cyan',
    timeWindowLabel: '09:00 PM – 04:59 AM',
    mode: 'dark',
    swatchBg: '#080B11',
    swatchSurface: '#111622',
    swatchAccent: '#38BDF8',
    themeColorHex: '#080B11',
  },
  {
    id: 'emerald',
    name: 'Botanical Forest',
    subtitle: 'Deep pine slate & luminous mint',
    timeWindowLabel: 'Custom Studio Palette',
    mode: 'dark',
    swatchBg: '#07120E',
    swatchSurface: '#0E1F18',
    swatchAccent: '#10B981',
    themeColorHex: '#07120E',
  },
  {
    id: 'crimson',
    name: 'Royal Velvet',
    subtitle: 'Onyx burgundy & rose-crimson',
    timeWindowLabel: 'Custom Sprint Palette',
    mode: 'dark',
    swatchBg: '#13090D',
    swatchSurface: '#1E1016',
    swatchAccent: '#F43F5E',
    themeColorHex: '#13090D',
  },
];

export function resolveTimeBasedPaletteId(currentHour: number = new Date().getHours()): ThemePaletteId {
  if (currentHour >= 5 && currentHour < 12) return 'sunrise';
  if (currentHour >= 12 && currentHour < 17) return 'daylight';
  if (currentHour >= 17 && currentHour < 21) return 'sunset';
  return 'midnight';
}

export function resolveActivePalette(
  autoTimeTheme: boolean,
  manualPaletteId: ThemePaletteId,
  currentHour: number = new Date().getHours()
): ThemePaletteMeta {
  const targetId = autoTimeTheme ? resolveTimeBasedPaletteId(currentHour) : manualPaletteId;
  return THEME_PALETTES.find((p) => p.id === targetId) || THEME_PALETTES[3];
}

export function resolveDayTheme(
  autoTheme: boolean,
  manualTheme: 'dark' | 'light',
  currentHour: number = new Date().getHours()
): 'dark' | 'light' {
  if (autoTheme) {
    return currentHour >= 5 && currentHour < 17 ? 'light' : 'dark';
  }
  return manualTheme;
}

export function formatLocalDateISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function addDaysISO(dateIso: string, days: number): string {
  const [y, m, d] = dateIso.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, (d || 1) + days);
  return formatLocalDateISO(dt);
}

export interface NoonRolloverState {
  /**
   * The active schedule date governed by the 12:00 PM Noon rollover rule:
   * - From 12:00 PM (Noon) to 11:59 PM today: shows Tomorrow's schedule (Calendar Today + 1 day)
   * - From 12:00 AM (Midnight) to 11:59 AM today: holds Today's schedule until 12:00 PM Noon
   */
  activeDateIso: string;
  calendarTodayIso: string;
  calendarTomorrowIso: string;
  isAfterNoon: boolean;
  rolloverCycleKey: string;
  statusLabel: string;
  shortBadgeLabel: string;
  countdownToNoonLabel: string;
}

export function computeNoonRolloverState(now: Date = new Date()): NoonRolloverState {
  const calendarTodayIso = formatLocalDateISO(now);
  const calendarTomorrowIso = addDaysISO(calendarTodayIso, 1);
  const hour = now.getHours();
  const isAfterNoon = hour >= 12;

  const activeDateIso = isAfterNoon ? calendarTomorrowIso : calendarTodayIso;

  // Calculate time remaining until the next 12:00 PM Noon rollover
  const nextNoon = new Date(now);
  if (isAfterNoon) {
    nextNoon.setDate(nextNoon.getDate() + 1);
  }
  nextNoon.setHours(12, 0, 0, 0);
  const diffMs = Math.max(0, nextNoon.getTime() - now.getTime());
  const totalMins = Math.floor(diffMs / 60000);
  const hrsLeft = Math.floor(totalMins / 60);
  const minsLeft = totalMins % 60;

  const countdownToNoonLabel =
    hrsLeft > 0 ? `${hrsLeft}h ${minsLeft}m to 12 PM rollover` : `${minsLeft}m to 12 PM rollover`;

  const statusLabel = isAfterNoon
    ? `Post-12 PM School Return · Showing Tomorrow (${calendarTomorrowIso}) till 12:00 PM`
    : `Morning Lock · Holding ${calendarTodayIso} till 12:00 PM (${countdownToNoonLabel})`;

  const shortBadgeLabel = isAfterNoon
    ? 'Tomorrow’s Prep (12 PM Auto)'
    : `Held till 12 PM (${hrsLeft}h ${minsLeft}m)`;

  return {
    activeDateIso,
    calendarTodayIso,
    calendarTomorrowIso,
    isAfterNoon,
    rolloverCycleKey: activeDateIso,
    statusLabel,
    shortBadgeLabel,
    countdownToNoonLabel,
  };
}

export function calculatePhase2Progress(
  schedule: ScheduleItem[],
  now: Date = new Date()
): {
  completedDays: number;
  totalDays: number;
  percent: number;
} {
  if (!schedule.length) {
    return { completedDays: 0, totalDays: 43, percent: 0 };
  }
  const todayIso = formatLocalDateISO(now);
  const totalDays = schedule.length;
  const completedDays = schedule.filter((item) => item.date < todayIso).length;
  const percent = Math.min(100, Math.max(0, Math.round((completedDays / totalDays) * 100)));
  return { completedDays, totalDays, percent };
}

export function calculateCountdown(targetIso: string, nowMs: number = Date.now()): CountdownParts {
  const targetMs = new Date(targetIso).getTime();
  const diff = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
}

export function isRealTestSubject(subject: string | null | undefined): boolean {
  if (!subject) return false;
  const lower = subject.toLowerCase();
  return (
    !lower.includes('vacation') &&
    !lower.includes('holiday') &&
    !lower.includes('motivation') &&
    !lower.includes('no scheduled') &&
    !lower.includes('self-study')
  );
}

export interface NextTestEvent {
  dateIso: string;
  targetDate: Date;
  label: string;
  slot: 'morning' | 'evening';
  countdown: CountdownParts;
}

export function findNextScheduledTest(
  schedule: ScheduleItem[],
  morningTime: string,
  eveningTime: string,
  now: Date = new Date()
): NextTestEvent | null {
  const nowMs = now.getTime();
  for (const item of schedule) {
    if (isRealTestSubject(item.test1_subject)) {
      const dt1 = new Date(`${item.date}T${morningTime}:00`);
      if (dt1.getTime() > nowMs) {
        return {
          dateIso: item.date,
          targetDate: dt1,
          label: item.test1_subject,
          slot: 'morning',
          countdown: calculateCountdown(dt1.toISOString(), nowMs),
        };
      }
    }
    if (isRealTestSubject(item.test2_subject)) {
      const dt2 = new Date(`${item.date}T${eveningTime}:00`);
      if (dt2.getTime() > nowMs) {
        return {
          dateIso: item.date,
          targetDate: dt2,
          label: item.test2_subject!,
          slot: 'evening',
          countdown: calculateCountdown(dt2.toISOString(), nowMs),
        };
      }
    }
  }
  return null;
}

export function splitPortionItems(portion: string | null | undefined): string[] {
  if (!portion) return [];
  return portion
    .split(/\s*\|\s*|\s*;\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function format12Hour(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hh, mm] = time24.split(':').map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time24;
  const period = hh >= 12 ? 'PM' : 'AM';
  const hour12 = String(hh % 12 || 12).padStart(2, '0');
  const minStr = String(mm).padStart(2, '0');
  return `${hour12}:${minStr} ${period}`;
}

export function filterScheduleFromTimetableStart(
  schedule: ScheduleItem[],
  startDateIso: string = TIMETABLE_START_DATE
): ScheduleItem[] {
  return schedule.filter((item) => item.date >= startDateIso);
}

export function extractSessionTag(rawCodeOrSubject: string | null | undefined): string {
  if (!rawCodeOrSubject) return 'session';
  const codeMatch = rawCodeOrSubject.match(/\b(?:MAT|PHY|CHE|BIO|SS|FL|SL|IT)[-\s]?(\d+)\b/i);
  if (codeMatch) {
    return `session-${codeMatch[1].padStart(2, '0')}`;
  }
  const parenMatch = rawCodeOrSubject.match(/Session\s*(\d+)/i);
  if (parenMatch) {
    return `session-${parenMatch[1].padStart(2, '0')}`;
  }
  return 'revision';
}

export interface ResolvedTomorrowSlots {
  morningSubject: string;
  morningPortion: string;
  morningSessionTag: string;
  eveningSubject: string | null;
  eveningPortion: string | null;
  eveningSessionTag: string;
  fatSubject: string;
  fatPortion: string;
  fatCode: string | null;
  fatIsScheduled: boolean;
  funworkSubject: string;
  funworkPortion: string;
}

export function resolveSessionSlotsForSection(
  scheduleItem: ScheduleItem,
  sectionTimetable: SectionDailySession[],
  activeSection: string
): ResolvedTomorrowSlots {
  const sectionEntry = sectionTimetable.find((s) => s.date === scheduleItem.date);
  const sectionSlot = sectionEntry?.sections[activeSection];

  let morningSubject = scheduleItem.test1_subject;
  let morningPortion = scheduleItem.test1_portion;
  let morningSessionTag = extractSessionTag(scheduleItem.test1_subject);

  if (sectionSlot?.fn && sectionSlot.fn !== '—') {
    const normalizedFn = normalizeSessionCode(sectionSlot.fn);
    const mapped = SUBJECT_CODES_MAP[normalizedFn] || SUBJECT_CODES_MAP[sectionSlot.fn];
    if (mapped) {
      morningSubject = `${mapped.subject} · ${normalizedFn}`;
      morningPortion = mapped.topic;
    } else {
      morningSubject = sectionSlot.fn;
    }
    morningSessionTag = extractSessionTag(normalizedFn);
  }

  let eveningSubject = scheduleItem.test2_subject;
  let eveningPortion = scheduleItem.test2_portion;
  let eveningSessionTag = extractSessionTag(scheduleItem.test2_subject);

  if (sectionSlot?.an && sectionSlot.an !== '—') {
    const normalizedAn = normalizeSessionCode(sectionSlot.an);
    const mapped = SUBJECT_CODES_MAP[normalizedAn] || SUBJECT_CODES_MAP[sectionSlot.an];
    if (mapped) {
      eveningSubject = `${mapped.subject} · ${normalizedAn}`;
      eveningPortion = mapped.topic;
    } else {
      eveningSubject = sectionSlot.an;
    }
    eveningSessionTag = extractSessionTag(normalizedAn);
  } else if (sectionSlot?.an === '—') {
    eveningSubject = null;
    eveningPortion = null;
    eveningSessionTag = 'none';
  }

  // Independent FAT Exam Portion (Taught 6:30 AM MCQs + Independent FAT Syllabus)
  let fatIsScheduled = false;
  let fatCode: string | null = null;
  let fatSubject = 'No FAT Exam Scheduled';
  let fatPortion = 'Teachers cover daily session MCQs at 6:30 AM · No separate FAT paper today.';

  if (sectionEntry?.fat && sectionEntry.fat !== 'None') {
    fatIsScheduled = true;
    fatCode = normalizeSessionCode(sectionEntry.fat);
    const mappedFat = FAT_EXAMS_MAP[fatCode] || FAT_EXAMS_MAP[sectionEntry.fat];
    if (mappedFat) {
      fatSubject = mappedFat.subject;
      fatPortion = mappedFat.topic;
    } else {
      fatSubject = `${fatCode} FAT`;
      fatPortion = 'Daily 6:30 AM MCQ class followed by FAT assessment.';
    }
  } else if (!sectionEntry && scheduleItem.fat_subject) {
    const isActuallyFat = scheduleItem.fat_subject.toUpperCase().includes('FAT #');
    if (isActuallyFat) {
      fatIsScheduled = true;
      fatSubject = scheduleItem.fat_subject;
      fatPortion = scheduleItem.fat_portion || 'Standard 20M / 30m FAT paper';
    }
  }

  // Independent Funwork Portion aligned to Updated 10A-10E Timetable & Syllabus PDF
  let funworkSubject = 'Daily Funwork Practice';
  let funworkPortion = 'Complete assigned daily revision worksheets.';

  const dailyFunwork = DAILY_FUNWORK_MAP[scheduleItem.date];
  if (dailyFunwork) {
    funworkSubject = dailyFunwork.subject;
    funworkPortion = dailyFunwork.topic;
  } else if (sectionEntry?.funwork && sectionEntry.funwork !== 'None') {
    const fwCode = sectionEntry.funwork.trim();
    const mappedFw = SUBJECT_CODES_MAP[fwCode];
    if (mappedFw) {
      funworkSubject = `${mappedFw.subject} · Funwork (${fwCode})`;
      funworkPortion = `${mappedFw.topic} — Complete daily Funwork drill sheets.`;
    } else {
      funworkSubject = `Funwork (${fwCode})`;
      funworkPortion = 'Complete assigned subject Funwork sheet.';
    }
  } else if (!sectionEntry && scheduleItem.fat_subject) {
    funworkSubject = scheduleItem.fat_subject;
    funworkPortion = scheduleItem.fat_portion || 'Consolidate notes & practice sheets.';
  }

  return {
    morningSubject,
    morningPortion,
    morningSessionTag,
    eveningSubject,
    eveningPortion,
    eveningSessionTag,
    fatSubject,
    fatPortion,
    fatCode,
    fatIsScheduled,
    funworkSubject,
    funworkPortion,
  };
}

export function detectHorizontalSwipe(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  currentTab: number,
  maxTab: number = 3
): number {
  const dx = endX - startX;
  const dy = endY - startY;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) {
    if (dx < 0) return Math.min(maxTab, currentTab + 1);
    return Math.max(0, currentTab - 1);
  }
  return currentTab;
}

export function getCbseBoardCountdown(nowMs: number = Date.now()): CountdownParts {
  return calculateCountdown(CBSE_2027_EXAM_CONFIG.firstExamDate, nowMs);
}

export type ViewStage = 'hero' | 'workspace';

export interface ScrollLockEvaluation {
  nextStage: ViewStage;
  nextUpwardImpulse: number;
  showResistanceHint: boolean;
}

export function evaluateStageScrollLock(
  currentStage: ViewStage,
  deltaY: number,
  workspaceScrollTop: number,
  prevUpwardImpulse: number
): ScrollLockEvaluation {
  if (currentStage === 'hero') {
    if (deltaY >= 12) {
      return {
        nextStage: 'workspace',
        nextUpwardImpulse: 0,
        showResistanceHint: false,
      };
    }
    return {
      nextStage: 'hero',
      nextUpwardImpulse: 0,
      showResistanceHint: false,
    };
  }

  if (workspaceScrollTop > 4 || deltaY >= 0) {
    return {
      nextStage: 'workspace',
      nextUpwardImpulse: 0,
      showResistanceHint: false,
    };
  }

  const upwardStrength = Math.abs(deltaY);
  if (upwardStrength < 4) {
    return {
      nextStage: 'workspace',
      nextUpwardImpulse: prevUpwardImpulse,
      showResistanceHint: false,
    };
  }

  const nextImpulse = prevUpwardImpulse + upwardStrength;
  if (upwardStrength >= 85 || nextImpulse >= 180) {
    return {
      nextStage: 'hero',
      nextUpwardImpulse: 0,
      showResistanceHint: false,
    };
  }

  return {
    nextStage: 'workspace',
    nextUpwardImpulse: nextImpulse,
    showResistanceHint: true,
  };
}

// ============================================================================
// Secret 4-Block Tap Code Evaluator (Single Combination: DAYS -> HOURS -> MINUTES -> SECONDS)
// ============================================================================

export const SECRET_TAP_SEQUENCES: number[][] = [
  [0, 1, 2, 3], // Single combination: DAYS (0) -> HOURS (1) -> MINUTES (2) -> SECONDS (3)
];

export interface SecretTapEvaluation {
  nextBuffer: number[];
  unlocked: boolean;
}

export function evaluateSecretBlockTap(
  prevBuffer: number[],
  tappedBlockIndex: number
): SecretTapEvaluation {
  const nextBuffer = [...prevBuffer, tappedBlockIndex].slice(-4);
  const unlocked = SECRET_TAP_SEQUENCES.some((seq) => {
    if (nextBuffer.length < seq.length) return false;
    const tail = nextBuffer.slice(nextBuffer.length - seq.length);
    return seq.every((val, idx) => tail[idx] === val);
  });

  return {
    nextBuffer: unlocked ? [] : nextBuffer,
    unlocked,
  };
}

// ============================================================================
// Passive Device-Based Formatting Engine (Mobile Edge-to-Edge vs Desktop Magnification)
// ============================================================================

export type DeviceFormFactor = 'compact-phone' | 'phone' | 'tablet' | 'desktop';
export type PassiveDeviceMode = 'mobile' | 'desktop';

export interface DeviceFormattingStyles {
  deviceMode: PassiveDeviceMode;
  formFactor: DeviceFormFactor;
  isMobile: boolean;
  isCoarsePointer: boolean;
  magnificationZoom: number;
  topBarHeightPx: number;
  topBarPaddingX: string;
  topBarFontSize: string;
  topBarPillPadding: string;
  heroCounterMaxWidth: string;
  heroBoxPaddingY: string;
  heroBoxPaddingX: string;
  heroBoxRadius: string;
  heroDigitFontSize: string;
  heroLabelFontSize: string;
  heroGap: string;
  workspaceMaxWidth: string;
  workspaceCardPadding: string;
  workspaceSectionGap: string;
}

export function computeDeviceFormatting(
  viewportWidth: number,
  viewportHeight: number = 844,
  isCoarsePointer: boolean = false,
  userAgent: string = ''
): DeviceFormattingStyles {
  const w = Math.max(280, viewportWidth || 390);
  const h = Math.max(480, viewportHeight || 844);
  const isShortScreen = h < 700;
  const uaMobileHint = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
  const isHandheld = w < 768 || (isCoarsePointer && w < 1024) || uaMobileHint;

  if (w < 380) {
    return {
      deviceMode: 'mobile',
      formFactor: 'compact-phone',
      isMobile: true,
      isCoarsePointer: true,
      magnificationZoom: 1,
      topBarHeightPx: 50,
      topBarPaddingX: '12px',
      topBarFontSize: '11px',
      topBarPillPadding: '4px 10px',
      heroCounterMaxWidth: '340px',
      heroBoxPaddingY: isShortScreen ? '12px' : '16px',
      heroBoxPaddingX: '8px',
      heroBoxRadius: '18px',
      heroDigitFontSize: '2.65rem',
      heroLabelFontSize: '10px',
      heroGap: '12px',
      workspaceMaxWidth: '100%',
      workspaceCardPadding: '16px',
      workspaceSectionGap: '14px',
    };
  }

  if (isHandheld && w < 768) {
    return {
      deviceMode: 'mobile',
      formFactor: 'phone',
      isMobile: true,
      isCoarsePointer: true,
      magnificationZoom: 1,
      topBarHeightPx: 52,
      topBarPaddingX: '14px',
      topBarFontSize: '12px',
      topBarPillPadding: '5px 12px',
      heroCounterMaxWidth: '390px',
      heroBoxPaddingY: isShortScreen ? '14px' : '18px',
      heroBoxPaddingX: '10px',
      heroBoxRadius: '20px',
      heroDigitFontSize: '3.05rem',
      heroLabelFontSize: '10.5px',
      heroGap: '14px',
      workspaceMaxWidth: '100%',
      workspaceCardPadding: '18px',
      workspaceSectionGap: '16px',
    };
  }

  if (w < 1024) {
    return {
      deviceMode: isHandheld ? 'mobile' : 'desktop',
      formFactor: 'tablet',
      isMobile: isHandheld,
      isCoarsePointer,
      magnificationZoom: isHandheld ? 1 : 1.05,
      topBarHeightPx: 54,
      topBarPaddingX: '20px',
      topBarFontSize: '12.5px',
      topBarPillPadding: '5px 14px',
      heroCounterMaxWidth: '680px',
      heroBoxPaddingY: '20px',
      heroBoxPaddingX: '14px',
      heroBoxRadius: '22px',
      heroDigitFontSize: '3.65rem',
      heroLabelFontSize: '11px',
      heroGap: '18px',
      workspaceMaxWidth: '760px',
      workspaceCardPadding: '22px',
      workspaceSectionGap: '18px',
    };
  }

  // Passive Desktop Computer Resolution Magnification (Scales proportionally to monitor width)
  const rawScale = 1.08 + Math.max(0, w - 1024) / 3600;
  const magnificationZoom = Number(Math.min(1.24, Math.max(1.08, rawScale)).toFixed(2));

  return {
    deviceMode: 'desktop',
    formFactor: 'desktop',
    isMobile: false,
    isCoarsePointer,
    magnificationZoom,
    topBarHeightPx: 58,
    topBarPaddingX: '26px',
    topBarFontSize: '13px',
    topBarPillPadding: '6px 16px',
    heroCounterMaxWidth: '860px',
    heroBoxPaddingY: '24px',
    heroBoxPaddingX: '18px',
    heroBoxRadius: '24px',
    heroDigitFontSize: '4.5rem',
    heroLabelFontSize: '12px',
    heroGap: '24px',
    workspaceMaxWidth: '880px',
    workspaceCardPadding: '24px',
    workspaceSectionGap: '20px',
  };
}

// ============================================================================
// Auto-Hiding Top Bar State Machine (Glides up & hides unless user scrolls up)
// ============================================================================

export function evaluateTopBarScrollVisibility(
  prevScrollTop: number,
  currentScrollTop: number,
  currentlyVisible: boolean
): { visible: boolean; deltaY: number } {
  const deltaY = currentScrollTop - prevScrollTop;
  // Scrolling up by at least 5px reveals the top bar immediately
  if (deltaY < -5) {
    return { visible: true, deltaY };
  }
  // Scrolling down hides the top bar immediately
  if (deltaY > 4) {
    return { visible: false, deltaY };
  }
  return { visible: currentlyVisible, deltaY };
}

// ============================================================================
// 2D Ragdoll Physics Engine (Gyroscope Tilt + Cursor Repulsion + Touch Drag)
// ============================================================================

export interface RagdollBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  vAngle: number;
  isDragging?: boolean;
}

export interface RagdollStepInput {
  gravityX: number; // e.g., from phone gamma tilt (-1.5 to +1.5)
  gravityY: number; // e.g., default +0.55 or from phone beta tilt
  pointerX: number | null;
  pointerY: number | null;
  pointerVx: number;
  pointerVy: number;
  boundsWidth: number;
  boundsHeight: number;
}

export function stepRagdollBodies(
  bodies: RagdollBody[],
  input: RagdollStepInput
): RagdollBody[] {
  const restitution = 0.64;
  const friction = 0.985;
  const angularFriction = 0.96;
  const next = bodies.map((b) => ({ ...b }));

  for (let i = 0; i < next.length; i++) {
    const b = next[i];
    if (b.isDragging) continue;

    // Apply gravity (controlled by gyroscope on phone or downward on PC)
    b.vx = (b.vx + input.gravityX) * friction;
    b.vy = (b.vy + input.gravityY) * friction;
    b.vAngle *= angularFriction;

    // Cursor / Touch interaction field
    if (input.pointerX !== null && input.pointerY !== null) {
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const dx = cx - input.pointerX;
      const dy = cy - input.pointerY;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(b.width, b.height) * 0.72 + 44;

      if (dist < radius && dist > 0.001) {
        const pushFactor = (1 - dist / radius) * 2.6;
        const nx = dx / dist;
        const ny = dy / dist;
        b.vx += nx * pushFactor + input.pointerVx * 0.22;
        b.vy += ny * pushFactor + input.pointerVy * 0.22;
        b.vAngle += ((dx * input.pointerVy - dy * input.pointerVx) * 0.0018) + (nx * 1.4);
      }
    }

    // Clamp max velocity for stability
    b.vx = Math.max(-26, Math.min(26, b.vx));
    b.vy = Math.max(-26, Math.min(26, b.vy));
    b.vAngle = Math.max(-14, Math.min(14, b.vAngle));

    b.x += b.vx;
    b.y += b.vy;
    b.angle += b.vAngle;

    // Wall & Floor Collisions
    const maxX = Math.max(0, input.boundsWidth - b.width);
    const maxY = Math.max(0, input.boundsHeight - b.height);

    if (b.x < 0) {
      b.x = 0;
      b.vx = Math.abs(b.vx) * restitution;
      b.vAngle += b.vy * 0.08;
    } else if (b.x > maxX) {
      b.x = maxX;
      b.vx = -Math.abs(b.vx) * restitution;
      b.vAngle -= b.vy * 0.08;
    }

    if (b.y < 0) {
      b.y = 0;
      b.vy = Math.abs(b.vy) * restitution;
    } else if (b.y > maxY) {
      b.y = maxY;
      b.vy = -Math.abs(b.vy) * restitution;
      b.vx *= 0.92;
      b.vAngle += b.vx * 0.12;
      if (Math.abs(b.vy) < 0.45) b.vy = 0;
    }
  }

  // Soft Pairwise Body Collisions so boxes and buttons tumble over each other
  for (let i = 0; i < next.length; i++) {
    for (let j = i + 1; j < next.length; j++) {
      const a = next[i];
      const b = next[j];
      const ax = a.x + a.width / 2;
      const ay = a.y + a.height / 2;
      const bx = b.x + b.width / 2;
      const by = b.y + b.height / 2;

      const overlapX = (a.width + b.width) * 0.44 - Math.abs(ax - bx);
      const overlapY = (a.height + b.height) * 0.44 - Math.abs(ay - by);

      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          const sign = ax < bx ? -1 : 1;
          const sep = overlapX * 0.5;
          if (!a.isDragging) a.x += sign * sep;
          if (!b.isDragging) b.x -= sign * sep;
          const avgVx = (a.vx - b.vx) * 0.42;
          if (!a.isDragging) {
            a.vx -= avgVx;
            a.vAngle += sign * 0.6;
          }
          if (!b.isDragging) {
            b.vx += avgVx;
            b.vAngle -= sign * 0.6;
          }
        } else {
          const sign = ay < by ? -1 : 1;
          const sep = overlapY * 0.5;
          if (!a.isDragging) a.y += sign * sep;
          if (!b.isDragging) b.y -= sign * sep;
          const avgVy = (a.vy - b.vy) * 0.42;
          if (!a.isDragging) {
            a.vy -= avgVy;
            a.vAngle += (ax - bx) * 0.015;
          }
          if (!b.isDragging) {
            b.vy += avgVy;
            b.vAngle -= (ax - bx) * 0.015;
          }
        }
      }
    }
  }

  return next;
}

// ============================================================================
// Phase-2 Analytics & Session Marks Matrix Engine
// ============================================================================

export interface SubjectDefinition {
  key: 'SS' | 'MAT' | 'FL' | 'SL' | 'PHY' | 'CHE' | 'BIO' | 'IT';
  name: string;
  totalSessions: number;
  schedulePrefix: string;
}

export const PHASE2_SUBJECT_DEFINITIONS: SubjectDefinition[] = [
  { key: 'SS', name: 'Social Science', totalSessions: 14, schedulePrefix: 'Social Science' },
  { key: 'MAT', name: 'Mathematics', totalSessions: 13, schedulePrefix: 'Mathematics' },
  { key: 'FL', name: 'English', totalSessions: 10, schedulePrefix: 'English' },
  { key: 'SL', name: 'Tamil', totalSessions: 10, schedulePrefix: 'Tamil' },
  { key: 'PHY', name: 'Physics', totalSessions: 6, schedulePrefix: 'Physics' },
  { key: 'CHE', name: 'Chemistry', totalSessions: 5, schedulePrefix: 'Chemistry' },
  { key: 'BIO', name: 'Biology', totalSessions: 5, schedulePrefix: 'Biology' },
  { key: 'IT', name: 'Information Technology', totalSessions: 3, schedulePrefix: 'Information Technology' },
];

export function normalizeSessionCode(rawCode: string): string {
  const cleaned = rawCode.trim().toUpperCase().replace(/\s+/g, '-');
  const match = cleaned.match(/^(MAT|PHY|CHE|BIO|SS|FL|SL|IT)-?(\d+)$/);
  if (!match) return cleaned;
  return `${match[1]}-${Number(match[2])}`;
}

export function resolveSessionDateMap(
  activeSection: string,
  scheduleList: ScheduleItem[] = DEFAULT_SCHEDULE,
  sectionTimetable: SectionDailySession[] = SECTION_TIMETABLE_DATA
): Record<string, string> {
  const dateMap: Record<string, string> = {};
  const minSectionSessionByKey: Record<string, number> = {};

  // 1. Scan section-specific timetable (>= 2026-11-10)
  for (const row of sectionTimetable) {
    const slot = row.sections[activeSection];
    if (!slot) continue;
    for (const raw of [slot.fn, slot.an]) {
      if (!raw || raw === '—') continue;
      let norm = normalizeSessionCode(raw);
      if (norm === 'IT-5') norm = 'IT-3';
      const parts = norm.match(/^(MAT|PHY|CHE|BIO|SS|FL|SL|IT)-(\d+)$/);
      if (parts) {
        const key = parts[1];
        const num = Number(parts[2]);
        if (!dateMap[norm]) {
          dateMap[norm] = row.date;
        }
        if (
          minSectionSessionByKey[key] === undefined ||
          num < minSectionSessionByKey[key]
        ) {
          minSectionSessionByKey[key] = num;
        }
      }
    }
  }

  // 2. Fallback to DEFAULT_SCHEDULE for pre-Nov 10 conducted sessions
  for (const item of scheduleList) {
    for (const rawSub of [item.test1_subject, item.test2_subject]) {
      if (!rawSub) continue;
      for (const def of PHASE2_SUBJECT_DEFINITIONS) {
        const re = new RegExp(`^${def.schedulePrefix}\\s*\\(Session\\s*(\\d+)`, 'i');
        const m = rawSub.match(re);
        if (m) {
          const num = Number(m[1]);
          const code = `${def.key}-${num}`;
          if (!dateMap[code]) {
            const minSecNum = minSectionSessionByKey[def.key];
            if (minSecNum !== undefined && num < minSecNum && item.date >= TIMETABLE_START_DATE) {
              // This section already completed this earlier session prior to Nov 10
              dateMap[code] = '2026-11-06';
            } else {
              dateMap[code] = item.date;
            }
          }
        }
      }
    }
  }

  return dateMap;
}

export function computeAnalyticsSummary(
  marksMap: SessionMarksMap,
  activeSection: string,
  referenceDateIso: string = formatLocalDateISO(new Date()),
  scheduleList: ScheduleItem[] = DEFAULT_SCHEDULE,
  sectionTimetable: SectionDailySession[] = SECTION_TIMETABLE_DATA
): OverallAnalyticsSummary {
  const dateMap = resolveSessionDateMap(activeSection, scheduleList, sectionTimetable);

  let totalMarksSecured = 0;
  let totalPossibleEntered = 0;
  let totalEnteredSessions = 0;
  let totalConductedSessions = 0;
  let totalSessions = 0;

  const subjects: SubjectAnalyticsSummary[] = PHASE2_SUBJECT_DEFINITIONS.map((def) => {
    const cells: SubjectSessionCell[] = [];
    let subjSecured = 0;
    let subjPossibleEntered = 0;
    let subjTotalMax = 0;
    let subjEnteredCount = 0;
    let subjConductedCount = 0;

    for (let num = 1; num <= def.totalSessions; num++) {
      const code = `${def.key}-${num}`;
      const maxMarks = code === 'MAT-8' ? 30 : 25;
      subjTotalMax += maxMarks;
      totalSessions += 1;

      const scheduledDate = dateMap[code] || null;
      const isConducted = scheduledDate !== null ? scheduledDate <= referenceDateIso : true;

      if (isConducted) {
        subjConductedCount += 1;
        totalConductedSessions += 1;
      }

      const rawEntered = marksMap[code];
      const hasValidMarks =
        typeof rawEntered === 'number' && !Number.isNaN(rawEntered) && rawEntered >= 0;
      const enteredMarks = hasValidMarks ? Math.min(maxMarks, rawEntered) : null;

      let status: SubjectSessionCell['status'];
      if (!isConducted) {
        status = 'non-conducted';
      } else if (enteredMarks !== null) {
        status = 'entered';
        subjEnteredCount += 1;
        totalEnteredSessions += 1;
        subjSecured += enteredMarks;
        subjPossibleEntered += maxMarks;
        totalMarksSecured += enteredMarks;
        totalPossibleEntered += maxMarks;
      } else {
        status = 'pending';
      }

      const topicMeta = SUBJECT_CODES_MAP[code];
      cells.push({
        code,
        subjectKey: def.key,
        subjectName: def.name,
        sessionNumber: num,
        topic: topicMeta ? topicMeta.topic : `${def.name} Session ${num}`,
        scheduledDate,
        maxMarks,
        enteredMarks,
        status,
      });
    }

    const averagePercent =
      subjPossibleEntered > 0
        ? Number(((subjSecured / subjPossibleEntered) * 100).toFixed(1))
        : null;

    return {
      subjectKey: def.key,
      subjectName: def.name,
      totalSessions: def.totalSessions,
      conductedSessions: subjConductedCount,
      enteredSessions: subjEnteredCount,
      marksSecured: subjSecured,
      totalPossibleEntered: subjPossibleEntered,
      totalSubjectMax: subjTotalMax,
      averagePercent,
      cells,
    };
  });

  const overallAveragePercent =
    totalPossibleEntered > 0
      ? Number(((totalMarksSecured / totalPossibleEntered) * 100).toFixed(1))
      : null;

  return {
    overallAveragePercent,
    totalMarksSecured,
    totalPossibleEntered,
    totalEnteredSessions,
    totalConductedSessions,
    totalSessions,
    subjects,
  };
}

