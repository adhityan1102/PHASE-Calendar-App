import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  findNextScheduledTest,
  resolveDayTheme,
  resolveTimeBasedPaletteId,
  resolveActivePalette,
  computeNoonRolloverState,
  calculatePhase2Progress,
  splitPortionItems,
  format12Hour,
  resolveSessionSlotsForSection,
  detectHorizontalSwipe,
  evaluateStageScrollLock,
  evaluateSecretBlockTap,
  computeDeviceFormatting,
  evaluateTopBarScrollVisibility,
  stepRagdollBodies,
  filterScheduleFromTimetableStart,
  extractSessionTag,
  resolveSessionDateMap,
  computeAnalyticsSummary,
} from './companionLogic';
import { DEFAULT_SCHEDULE, SECTION_TIMETABLE_DATA } from '../data/scheduleData';

test('calculateCountdown returns exact days, hours, minutes, seconds for CBSE 2027 exam start', () => {
  const target = '2027-02-16T10:30:00+05:30';
  const oneDayBefore = new Date('2027-02-15T09:00:00+05:30').getTime();
  const res = calculateCountdown(target, oneDayBefore);
  assert.equal(res.days, 1);
  assert.equal(res.hours, 1);
  assert.equal(res.minutes, 30);
  assert.equal(res.seconds, 0);
});

test('resolveDayTheme and resolveTimeBasedPaletteId switch palettes based on time of day', () => {
  assert.equal(resolveDayTheme(true, 'dark', 10), 'light');
  assert.equal(resolveDayTheme(true, 'light', 21), 'dark');
  assert.equal(resolveDayTheme(false, 'light', 22), 'light');
  assert.equal(resolveDayTheme(false, 'dark', 12), 'dark');

  assert.equal(resolveTimeBasedPaletteId(7), 'sunrise');
  assert.equal(resolveTimeBasedPaletteId(14), 'daylight');
  assert.equal(resolveTimeBasedPaletteId(18), 'sunset');
  assert.equal(resolveTimeBasedPaletteId(23), 'midnight');

  const autoMorning = resolveActivePalette(true, 'crimson', 8);
  assert.equal(autoMorning.id, 'sunrise');
  assert.equal(autoMorning.mode, 'light');

  const manualCrimson = resolveActivePalette(false, 'crimson', 8);
  assert.equal(manualCrimson.id, 'crimson');
  assert.equal(manualCrimson.mode, 'dark');
});

test('computeNoonRolloverState holds Today before 12:00 PM and advances to Tomorrow at 12:00 PM', () => {
  const morningDate = new Date(2026, 10, 14, 9, 30, 0);
  const morningRollover = computeNoonRolloverState(morningDate);
  assert.equal(morningRollover.isAfterNoon, false);
  assert.equal(morningRollover.calendarTodayIso, '2026-11-14');
  assert.equal(morningRollover.calendarTomorrowIso, '2026-11-15');
  assert.equal(morningRollover.activeDateIso, '2026-11-14');

  const noonDate = new Date(2026, 10, 14, 12, 0, 0);
  const noonRollover = computeNoonRolloverState(noonDate);
  assert.equal(noonRollover.isAfterNoon, true);
  assert.equal(noonRollover.activeDateIso, '2026-11-15');

  const nextMorningDate = new Date(2026, 10, 15, 8, 15, 0);
  const nextMorningRollover = computeNoonRolloverState(nextMorningDate);
  assert.equal(nextMorningRollover.isAfterNoon, false);
  assert.equal(nextMorningRollover.activeDateIso, '2026-11-15');
});

test('calculatePhase2Progress computes accurate completion percentage', () => {
  const midDate = new Date(2026, 10, 14, 10, 0, 0);
  const prog = calculatePhase2Progress(DEFAULT_SCHEDULE, midDate);
  assert.ok(prog.totalDays > 30);
  assert.ok(prog.completedDays > 0);
  assert.ok(prog.percent > 0 && prog.percent <= 100);
});

test('splitPortionItems splits by pipe and semicolon cleanly', () => {
  const items = splitPortionItems('Real Numbers | Polynomials ; Quadratic Equations');
  assert.deepEqual(items, ['Real Numbers', 'Polynomials', 'Quadratic Equations']);
  assert.deepEqual(splitPortionItems(null), []);
});

test('format12Hour formats 24-hour strings into 12-hour AM/PM', () => {
  assert.equal(format12Hour('09:00'), '09:00 AM');
  assert.equal(format12Hour('14:30'), '02:30 PM');
  assert.equal(format12Hour('00:15'), '12:15 AM');
});

test('resolveSessionSlotsForSection resolves Class 10B specific timetable accurately', () => {
  const nov11 = DEFAULT_SCHEDULE.find((d) => d.date === '2026-11-11')!;
  const resolved10B = resolveSessionSlotsForSection(nov11, SECTION_TIMETABLE_DATA, '10B');
  assert.ok(resolved10B.morningSubject.includes('Tamil (Session 5)'));
  assert.ok(resolved10B.eveningSubject?.includes('Biology (Session 3)'));
});

test('detectHorizontalSwipe advances or retreats slide only on deliberate horizontal swipe', () => {
  assert.equal(detectHorizontalSwipe(300, 200, 180, 210, 0, 3), 1);
  assert.equal(detectHorizontalSwipe(100, 200, 220, 210, 2, 3), 1);
  assert.equal(detectHorizontalSwipe(200, 400, 160, 250, 1, 3), 1);
});

test('findNextScheduledTest skips vacation days and finds next real test', () => {
  const now = new Date('2026-10-18T10:00:00');
  const next = findNextScheduledTest(DEFAULT_SCHEDULE, '09:00', '14:30', now);
  assert.ok(next !== null);
  assert.equal(next?.dateIso, '2026-10-22');
  assert.equal(next?.label, 'Mathematics (Session 1)');
});

test('evaluateStageScrollLock glides down on normal scroll and requires stronger upward scroll to return to hero', () => {
  const downRes = evaluateStageScrollLock('hero', 25, 0, 0);
  assert.equal(downRes.nextStage, 'workspace');

  const gentleUp = evaluateStageScrollLock('workspace', -35, 0, 0);
  assert.equal(gentleUp.nextStage, 'workspace');
  assert.equal(gentleUp.showResistanceHint, true);
  assert.equal(gentleUp.nextUpwardImpulse, 35);

  const strongUp = evaluateStageScrollLock('workspace', -95, 0, 35);
  assert.equal(strongUp.nextStage, 'hero');
  assert.equal(strongUp.showResistanceHint, false);
});

test('evaluateSecretBlockTap unlocks ragdoll mode only on single [0,1,2,3] combination', () => {
  let buf: number[] = [];
  let res = evaluateSecretBlockTap(buf, 0);
  assert.equal(res.unlocked, false);
  res = evaluateSecretBlockTap(res.nextBuffer, 1);
  assert.equal(res.unlocked, false);
  res = evaluateSecretBlockTap(res.nextBuffer, 2);
  assert.equal(res.unlocked, false);
  res = evaluateSecretBlockTap(res.nextBuffer, 3);
  assert.equal(res.unlocked, true);
  assert.deepEqual(res.nextBuffer, []);

  // Reverse sequence [3,2,1,0] does NOT unlock since only one combination is active
  let revBuf: number[] = [];
  revBuf = evaluateSecretBlockTap(revBuf, 3).nextBuffer;
  revBuf = evaluateSecretBlockTap(revBuf, 2).nextBuffer;
  revBuf = evaluateSecretBlockTap(revBuf, 1).nextBuffer;
  const revFinal = evaluateSecretBlockTap(revBuf, 0);
  assert.equal(revFinal.unlocked, false);
});

test('computeDeviceFormatting identifies mobile vs desktop passively and computes desktop magnification', () => {
  const compact = computeDeviceFormatting(350, 740, true);
  assert.equal(compact.formFactor, 'compact-phone');
  assert.equal(compact.deviceMode, 'mobile');
  assert.equal(compact.isMobile, true);
  assert.equal(compact.magnificationZoom, 1);

  const phone = computeDeviceFormatting(390, 844, true);
  assert.equal(phone.formFactor, 'phone');
  assert.equal(phone.deviceMode, 'mobile');
  assert.equal(phone.magnificationZoom, 1);

  const desktop = computeDeviceFormatting(1440, 900, false);
  assert.equal(desktop.formFactor, 'desktop');
  assert.equal(desktop.deviceMode, 'desktop');
  assert.equal(desktop.isMobile, false);
  assert.ok(desktop.magnificationZoom > 1.1);
});

test('evaluateTopBarScrollVisibility hides top bar on downward scroll and reveals on upward scroll', () => {
  const down = evaluateTopBarScrollVisibility(20, 60, true);
  assert.equal(down.visible, false);

  const up = evaluateTopBarScrollVisibility(60, 35, false);
  assert.equal(up.visible, true);

  const idle = evaluateTopBarScrollVisibility(35, 36, false);
  assert.equal(idle.visible, false);
});

test('stepRagdollBodies updates positions under gravity, cursor repulsion, and floor bounce', () => {
  const initial = [
    {
      id: 'box-0',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      width: 120,
      height: 120,
      angle: 0,
      vAngle: 0,
    },
  ];
  const stepped = stepRagdollBodies(initial, {
    gravityX: 0.4,
    gravityY: 0.8,
    pointerX: 150,
    pointerY: 150,
    pointerVx: 10,
    pointerVy: -5,
    boundsWidth: 390,
    boundsHeight: 844,
  });
  assert.notEqual(stepped[0].x, 100);
  assert.notEqual(stepped[0].y, 100);
});

test('filterScheduleFromTimetableStart enforces Nov 10 start date matching 10A-10E timetable', () => {
  const filtered = filterScheduleFromTimetableStart(DEFAULT_SCHEDULE);
  assert.ok(filtered.length > 0);
  assert.equal(filtered[0].date, '2026-11-10');
  assert.equal(filtered.some((d) => d.date < '2026-11-10'), false);
});

test('resolveSessionSlotsForSection separates independent FAT exam and Funwork portions', () => {
  const nov16 = DEFAULT_SCHEDULE.find((d) => d.date === '2026-11-16')!;
  const slots10B = resolveSessionSlotsForSection(nov16, SECTION_TIMETABLE_DATA, '10B');
  assert.equal(slots10B.morningSessionTag, 'session-06');
  assert.equal(slots10B.eveningSessionTag, 'session-10');
  assert.equal(slots10B.fatIsScheduled, true);
  assert.equal(slots10B.fatCode, 'SL-2');
  assert.ok(slots10B.fatSubject.includes('Tamil FAT-2'));
  assert.ok(slots10B.fatPortion.includes('Fun Works 3 & 4'));
  assert.ok(slots10B.funworkSubject.includes('Sheets 13–18'));
  assert.ok(slots10B.funworkPortion.includes('Geo-3 Water Resources'));

  // Nov 17: SS-3 FAT must resolve Social Science FAT-3 (Day 5 & 6), NOT Session 3 Eco-1/Eco-4
  const nov17 = DEFAULT_SCHEDULE.find((d) => d.date === '2026-11-17')!;
  const slots10C = resolveSessionSlotsForSection(nov17, SECTION_TIMETABLE_DATA, '10C');
  assert.ok(slots10C.fatSubject.includes('Social Science FAT-3'));
  assert.ok(slots10C.fatPortion.includes('Day 5 & 6 Funworks'));
  assert.ok(slots10C.funworkSubject.includes('Funwork 5 & 6'));
  assert.ok(slots10C.funworkPortion.includes('Question of Trust'));

  // Nov 13 10C: FL-6 session portion must include SR chapters
  const nov13 = DEFAULT_SCHEDULE.find((d) => d.date === '2026-11-13')!;
  const nov13_10C = resolveSessionSlotsForSection(nov13, SECTION_TIMETABLE_DATA, '10C');
  assert.ok(nov13_10C.eveningPortion?.includes('Footprints without Feet'));
});

test('extractSessionTag parses session numbers into padded session-xx labels', () => {
  assert.equal(extractSessionTag('MAT-8'), 'session-08');
  assert.equal(extractSessionTag('Social Science (Session 14)'), 'session-14');
  assert.equal(extractSessionTag('CHE'), 'revision');
});

test('computeAnalyticsSummary builds 66 sessions across 8 subjects with accurate red/green/white statuses', () => {
  const dateMap10B = resolveSessionDateMap('10B');
  assert.equal(dateMap10B['MAT-8'], '2026-11-10');
  assert.equal(dateMap10B['MAT-13'], '2026-11-27');

  const summary = computeAnalyticsSummary(
    { 'MAT-1': 24, 'SS-1': 22, 'MAT-8': 28 },
    '10B',
    '2026-11-16'
  );

  assert.equal(summary.totalSessions, 66);
  assert.equal(summary.totalMarksSecured, 74); // 24 + 22 + 28
  assert.equal(summary.totalPossibleEntered, 80); // 25 + 25 + 30
  assert.equal(summary.overallAveragePercent, 92.5);
  assert.equal(summary.totalEnteredSessions, 3);

  const maths = summary.subjects.find((s) => s.subjectKey === 'MAT')!;
  assert.equal(maths.totalSessions, 13);
  const mat8 = maths.cells.find((c) => c.code === 'MAT-8')!;
  const mat10 = maths.cells.find((c) => c.code === 'MAT-10')!;
  const mat9 = maths.cells.find((c) => c.code === 'MAT-9')!;

  assert.equal(mat8.status, 'entered'); // 2026-11-10 <= 2026-11-16 & marks entered -> white
  assert.equal(mat9.status, 'pending'); // 2026-11-13 <= 2026-11-16 & no marks -> green
  assert.equal(mat10.status, 'non-conducted'); // 2026-11-17 > 2026-11-16 -> red
});

