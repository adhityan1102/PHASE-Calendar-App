import React, { useEffect, useState } from 'react';

interface AppSplashScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  isVisible,
  onComplete,
}) => {
  const [exiting, setExiting] = useState(false);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isVisible) {
      setExiting(false);
      return;
    }
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 820);

    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 1150);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-label="Launching PHASE Revision Companion"
      data-testid="app-launch-splash"
      onClick={() => {
        setExiting(true);
        setTimeout(onComplete, 180);
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 select-none cursor-pointer transition-opacity duration-350 ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'splash-fade-in'
      }`}
      style={{
        backgroundColor: '#080B11',
        backgroundImage:
          'radial-gradient(circle at 50% 46%, rgba(56, 189, 248, 0.16), rgba(99, 102, 241, 0.06) 44%, transparent 72%)',
      }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="splashAmbientGlow" cx="50%" cy="50%" r="48%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#818CF8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#080B11" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="splashRingGrad" x1="12%" y1="88%" x2="88%" y2="12%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="52%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>

            <circle cx="256" cy="256" r="230" fill="url(#splashAmbientGlow)" />

            <circle
              cx="256"
              cy="256"
              r="154"
              fill="#0D1320"
              stroke="#1E293B"
              strokeWidth="2"
            />

            <circle
              cx="256"
              cy="256"
              r="174"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2"
              strokeDasharray="4 14"
              opacity="0.75"
            />

            <circle
              cx="256"
              cy="256"
              r="146"
              fill="none"
              stroke="#172033"
              strokeWidth="18"
            />

            <circle
              cx="256"
              cy="256"
              r="146"
              fill="none"
              stroke="url(#splashRingGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray="680 920"
              transform="rotate(132 256 256)"
            />

            <circle cx="348" cy="143" r="15" fill="#10B981" />
            <circle cx="348" cy="143" r="7" fill="#ECFDF5" />

            <text
              x="256"
              y="286"
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="118"
              fill="#F8FAFC"
              textAnchor="middle"
              letterSpacing="-2"
            >
              P
            </text>

            <text
              x="256"
              y="338"
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="700"
              fontSize="16"
              fill="#94A3B8"
              letterSpacing="5"
              textAnchor="middle"
            >
              PHASE &apos;27
            </text>
          </svg>
        </div>

        <h2 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100 text-center">
          PHASE Revision Companion
        </h2>
      </div>
    </div>
  );
};
