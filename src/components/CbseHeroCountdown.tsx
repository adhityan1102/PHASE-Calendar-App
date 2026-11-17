import React, { useState, useEffect, useRef } from 'react';
import { CBSE_2027_EXAM_CONFIG } from '../data/scheduleData';
import {
  calculateCountdown,
  evaluateSecretBlockTap,
  DeviceFormattingStyles,
  RagdollBody,
  stepRagdollBodies,
} from '../utils/companionLogic';
import { ChevronDown, RotateCcw } from 'lucide-react';

interface CbseHeroCountdownProps {
  onScrollToContent: () => void;
  isScrolled: boolean;
  splashCompleted: boolean;
  deviceStyles: DeviceFormattingStyles;
}

export const CbseHeroCountdown: React.FC<CbseHeroCountdownProps> = ({
  onScrollToContent,
  isScrolled,
  splashCompleted,
  deviceStyles,
}) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    calculateCountdown(CBSE_2027_EXAM_CONFIG.firstExamDate)
  );

  // Single Secret 4-Unit Tap Buffer: DAYS (0) -> HOURS (1) -> MINUTES (2) -> SECONDS (3)
  const tapBufferRef = useRef<number[]>([]);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ragdoll Physics Easter Egg State
  const [ragdollActive, setRagdollActive] = useState(false);
  const [ragdollBodies, setRagdollBodies] = useState<RagdollBody[]>([]);
  const ragdollBodiesRef = useRef<RagdollBody[]>([]);
  const stageRef = useRef<HTMLElement | null>(null);
  const elemRefs = useRef<Record<string, HTMLElement | null>>({});

  // Gyroscope & Pointer Refs for 60fps Physics Loop
  const gravityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.52 });
  const pointerRef = useRef<{
    x: number | null;
    y: number | null;
    vx: number;
    vy: number;
    draggingId: string | null;
    dragOffsetX: number;
    dragOffsetY: number;
  }>({
    x: null,
    y: null,
    vx: 0,
    vy: 0,
    draggingId: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateCountdown(CBSE_2027_EXAM_CONFIG.firstExamDate));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const activateRagdollMode = () => {
    try {
      const DevOrient = (window as unknown as {
        DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
      }).DeviceOrientationEvent;
      if (DevOrient && typeof DevOrient.requestPermission === 'function') {
        DevOrient.requestPermission().catch(() => {});
      }
    } catch (_) {
      // Ignore permission errors on non-iOS browsers
    }

    const keys = ['header', 'block-0', 'block-1', 'block-2', 'block-3', 'scroll-cta'];
    const initialBodies: RagdollBody[] = [];

    keys.forEach((id, i) => {
      const el = elemRefs.current[id];
      const rect = el?.getBoundingClientRect();
      const w = rect ? rect.width : 140;
      const h = rect ? rect.height : 96;
      const x = rect ? rect.left : 60 + (i % 2) * 160;
      const y = rect ? rect.top : 120 + i * 70;

      initialBodies.push({
        id,
        x,
        y,
        vx: (Math.random() - 0.5) * 9,
        vy: -3 - Math.random() * 4,
        width: w,
        height: h,
        angle: (Math.random() - 0.5) * 12,
        vAngle: (Math.random() - 0.5) * 3.5,
      });
    });

    ragdollBodiesRef.current = initialBodies;
    setRagdollBodies(initialBodies);
    setRagdollActive(true);
  };

  const resetRagdollMode = () => {
    setRagdollActive(false);
    ragdollBodiesRef.current = [];
    setRagdollBodies([]);
    pointerRef.current.draggingId = null;
  };

  useEffect(() => {
    if (!ragdollActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = typeof e.gamma === 'number' ? e.gamma : 0;
      const beta = typeof e.beta === 'number' ? e.beta : 45;
      const gx = Math.max(-1.4, Math.min(1.4, (gamma / 45) * 0.95));
      const gy = Math.max(-1.2, Math.min(1.4, ((beta - 35) / 45) * 0.85));
      gravityRef.current = { x: gx, y: gy };
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;
      if (Math.abs(acc.x || 0) > 14 || Math.abs(acc.y || 0) > 14) {
        ragdollBodiesRef.current = ragdollBodiesRef.current.map((b) => ({
          ...b,
          vx: b.vx + (Math.random() - 0.5) * 12,
          vy: b.vy - Math.random() * 10,
          vAngle: b.vAngle + (Math.random() - 0.5) * 5,
        }));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetRagdollMode();
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('keydown', handleKeyDown);

    let rafId = 0;
    const loop = () => {
      const boundsW = window.innerWidth || 390;
      const boundsH = window.innerHeight || 844;
      const p = pointerRef.current;

      const stepped = stepRagdollBodies(ragdollBodiesRef.current, {
        gravityX: gravityRef.current.x,
        gravityY: gravityRef.current.y,
        pointerX: p.x,
        pointerY: p.y,
        pointerVx: p.vx,
        pointerVy: p.vy,
        boundsWidth: boundsW,
        boundsHeight: boundsH,
      });

      pointerRef.current.vx *= 0.6;
      pointerRef.current.vy *= 0.6;

      ragdollBodiesRef.current = stepped;
      setRagdollBodies(stepped);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ragdollActive]);

  const handleCounterBlockTap = (blockIdx: number) => {
    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current);
    }
    const res = evaluateSecretBlockTap(tapBufferRef.current, blockIdx);
    tapBufferRef.current = res.nextBuffer;

    if (res.unlocked) {
      tapBufferRef.current = [];
      if (ragdollActive) {
        resetRagdollMode();
      } else {
        activateRagdollMode();
      }
      return;
    }

    tapResetTimerRef.current = setTimeout(() => {
      tapBufferRef.current = [];
    }, 4500);
  };

  const getBodyStyle = (id: string): React.CSSProperties | undefined => {
    if (!ragdollActive) return undefined;
    const b = ragdollBodies.find((item) => item.id === id);
    if (!b) return undefined;
    return {
      position: 'fixed',
      left: 0,
      top: 0,
      width: `${b.width}px`,
      transform: `translate3d(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px, 0) rotate(${b.angle.toFixed(2)}deg)`,
      zIndex: 45,
      touchAction: 'none',
      cursor: 'grab',
      transition: 'none',
    };
  };

  const handleStagePointerMove = (clientX: number, clientY: number) => {
    if (!ragdollActive) return;
    const p = pointerRef.current;
    p.vx = clientX - (p.x ?? clientX);
    p.vy = clientY - (p.y ?? clientY);
    p.x = clientX;
    p.y = clientY;

    if (p.draggingId) {
      ragdollBodiesRef.current = ragdollBodiesRef.current.map((b) =>
        b.id === p.draggingId
          ? {
              ...b,
              x: clientX - p.dragOffsetX,
              y: clientY - p.dragOffsetY,
              vx: p.vx * 0.85,
              vy: p.vy * 0.85,
              vAngle: p.vx * 0.18,
            }
          : b
      );
    }
  };

  const handleBodyPointerDown = (
    id: string,
    clientX: number,
    clientY: number,
    e: React.PointerEvent
  ) => {
    if (!ragdollActive) return;
    e.stopPropagation();
    const target = ragdollBodiesRef.current.find((b) => b.id === id);
    if (!target) return;
    pointerRef.current.draggingId = id;
    pointerRef.current.dragOffsetX = clientX - target.x;
    pointerRef.current.dragOffsetY = clientY - target.y;
    pointerRef.current.x = clientX;
    pointerRef.current.y = clientY;
    ragdollBodiesRef.current = ragdollBodiesRef.current.map((b) =>
      b.id === id ? { ...b, isDragging: true } : b
    );
  };

  const handleStagePointerUp = () => {
    if (!ragdollActive) return;
    if (pointerRef.current.draggingId) {
      ragdollBodiesRef.current = ragdollBodiesRef.current.map((b) =>
        b.id === pointerRef.current.draggingId ? { ...b, isDragging: false } : b
      );
      pointerRef.current.draggingId = null;
    }
  };

  const timerUnits = [
    { value: timeLeft.days, label: 'DAYS', pad: 2 },
    { value: timeLeft.hours, label: 'HOURS', pad: 2 },
    { value: timeLeft.minutes, label: 'MINUTES', pad: 2 },
    { value: timeLeft.seconds, label: 'SECONDS', pad: 2 },
  ];

  // Fast 0.7s entrance with light stagger so whole counter finishes arriving inside ~0.75s
  const unitDelays = ['0ms', '45ms', '90ms', '135ms'];

  return (
    <section
      ref={stageRef}
      aria-label="Board Exam Timer"
      onPointerMove={(e) => handleStagePointerMove(e.clientX, e.clientY)}
      onPointerUp={handleStagePointerUp}
      onPointerCancel={handleStagePointerUp}
      onPointerLeave={() => {
        pointerRef.current.x = null;
        pointerRef.current.y = null;
      }}
      className="relative h-[100dvh] w-full shrink-0 flex flex-col justify-between items-center text-center px-5 sm:px-8 py-6 sm:py-8 select-none bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 overflow-hidden"
    >
      <div className="w-full h-2 shrink-0" aria-hidden="true" />

      {ragdollActive && (
        <div
          data-testid="ragdoll-easter-egg-banner"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)]/95 backdrop-blur-md text-xs font-mono text-[var(--text)] flex items-center gap-2.5 whitespace-nowrap animate-fadeIn"
          style={{ boxShadow: 'var(--shadow-modal)' }}
        >
          <span>Ragdoll · Tilt / Drag</span>
          <button
            type="button"
            data-testid="reset-ragdoll-button"
            onClick={resetRagdollMode}
            className="px-2.5 py-1 rounded-full bg-[var(--text)] text-[var(--bg)] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Center Stage: Only Minimal Board Exam Timer Heading + Boxless Countdown Digits */}
      <div
        className={`my-auto w-full max-w-4xl mx-auto flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled && !ragdollActive
            ? 'opacity-0 scale-90 -translate-y-16 pointer-events-none'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div
          ref={(el) => {
            elemRefs.current['header'] = el;
          }}
          onPointerDown={(e) => handleBodyPointerDown('header', e.clientX, e.clientY, e)}
          style={
            ragdollActive
              ? getBodyStyle('header')
              : splashCompleted
              ? undefined
              : { opacity: 0 }
          }
          className={splashCompleted && !ragdollActive ? 'timer-fast-reveal mb-8 sm:mb-10' : 'mb-8 sm:mb-10'}
        >
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Board Exam Timer
          </h1>
        </div>

        {/* 4 Boxless Typographic Countdown Units */}
        <div
          data-testid="hero-cbse-countdown"
          className="w-full mx-auto grid grid-cols-2 sm:grid-cols-4"
          style={{
            maxWidth: deviceStyles.heroCounterMaxWidth,
            gap: deviceStyles.heroGap,
          }}
        >
          {timerUnits.map((unit, idx) => {
            const bodyId = `block-${idx}`;
            return (
              <div
                key={unit.label}
                ref={(el) => {
                  elemRefs.current[bodyId] = el;
                }}
                data-testid={`counter-block-${idx}`}
                onClick={() => handleCounterBlockTap(idx)}
                onPointerDown={(e) => handleBodyPointerDown(bodyId, e.clientX, e.clientY, e)}
                className={`flex flex-col items-center justify-center transition-transform duration-150 active:scale-[0.97] cursor-pointer ${
                  splashCompleted && !ragdollActive ? 'timer-fast-reveal' : ''
                }`}
                style={{
                  paddingTop: deviceStyles.heroBoxPaddingY,
                  paddingBottom: deviceStyles.heroBoxPaddingY,
                  paddingLeft: deviceStyles.heroBoxPaddingX,
                  paddingRight: deviceStyles.heroBoxPaddingX,
                  ...(ragdollActive
                    ? getBodyStyle(bodyId)
                    : splashCompleted
                    ? { animationDelay: unitDelays[idx] }
                    : { opacity: 0 }),
                }}
              >
                <span
                  className="font-mono tabular-nums font-extrabold tracking-tight text-[var(--text)] leading-none"
                  style={{ fontSize: deviceStyles.heroDigitFontSize }}
                >
                  {String(unit.value).padStart(unit.pad, '0')}
                </span>
                <span
                  className="mt-2.5 font-mono tracking-[0.24em] uppercase text-[var(--text-muted)]"
                  style={{ fontSize: deviceStyles.heroLabelFontSize }}
                >
                  {unit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bare Chevron Action (No text on page) */}
      <div
        ref={(el) => {
          elemRefs.current['scroll-cta'] = el;
        }}
        onPointerDown={(e) => handleBodyPointerDown('scroll-cta', e.clientX, e.clientY, e)}
        className={`w-full flex justify-center pt-1 ${
          splashCompleted && !ragdollActive ? 'timer-fast-reveal' : ''
        }`}
        style={
          ragdollActive
            ? getBodyStyle('scroll-cta')
            : splashCompleted
            ? { animationDelay: '160ms' }
            : { opacity: 0 }
        }
      >
        <button
          type="button"
          onClick={onScrollToContent}
          aria-label="Open Companion"
          data-testid="enter-workspace-button"
          className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
