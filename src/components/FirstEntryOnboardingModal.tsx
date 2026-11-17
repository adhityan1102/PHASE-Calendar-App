import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { Loader2, ArrowRight } from 'lucide-react';

interface FirstEntryOnboardingModalProps {
  isOpen: boolean;
  initialName: string;
  initialEmail: string;
  initialSection: string;
  onComplete: (data: { name: string; email: string; classSection: string }) => void;
}

const SECTIONS = ['10A', '10B', '10C', '10D', '10E'];

export const FirstEntryOnboardingModal: React.FC<FirstEntryOnboardingModalProps> = ({
  isOpen,
  initialName,
  initialEmail,
  initialSection,
  onComplete,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAutofill = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg(null);
      const user = await signInWithGoogle();
      if (user.displayName && !name.trim()) {
        setName(user.displayName);
      }
      if (user.email) {
        setEmail(user.email);
      }
    } catch (err: any) {
      setErrorMsg('Google Sign-In was cancelled or blocked. You can still fill details below.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!SECTIONS.includes(selectedSection)) {
      setErrorMsg('Please select your class section (10A–10E).');
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid Gmail address.');
      return;
    }

    onComplete({
      name: cleanName,
      email: cleanEmail,
      classSection: selectedSection,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to PHASE Setup"
      data-testid="first-entry-onboarding"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[var(--bg)]/95 backdrop-blur-xl animate-fadeIn overflow-y-auto"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] p-6 sm:p-7 space-y-5 my-auto"
        style={{ boxShadow: 'var(--shadow-modal)' }}
      >
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[var(--accent-brand)] block">
            PHASE · STUDENT SETUP
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
            Welcome to PHASE
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Choose your class section and enter your details to tailor your timetable and marks analytics.
          </p>
        </div>

        {/* Optional Google Quick Fill + Cloud Link */}
        <button
          type="button"
          onClick={handleGoogleAutofill}
          disabled={googleLoading}
          data-testid="onboarding-google-signin"
          className="w-full py-2.5 px-4 rounded-xl border border-[var(--border-strong)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--text)] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
          )}
          <span>Connect Google Account (Auto-fill Gmail)</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label
              htmlFor="onboarding-name"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
            >
              Your Name
            </label>
            <input
              id="onboarding-name"
              type="text"
              data-testid="onboarding-name-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          {/* Class Section */}
          <div>
            <span className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Choose Class Section
            </span>
            <div className="grid grid-cols-5 gap-2">
              {SECTIONS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  data-testid={`onboarding-section-${sec}`}
                  onClick={() => {
                    setSelectedSection(sec);
                    setErrorMsg(null);
                  }}
                  className={`py-2.5 rounded-xl border font-mono text-xs font-bold transition-colors cursor-pointer ${
                    selectedSection === sec
                      ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Gmail Address */}
          <div>
            <label
              htmlFor="onboarding-email"
              className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5"
            >
              Gmail Address
            </label>
            <input
              id="onboarding-email"
              type="email"
              data-testid="onboarding-email-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="yourname@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            data-testid="onboarding-submit"
            className="w-full py-3 px-4 rounded-xl bg-[var(--text)] text-[var(--bg)] text-sm font-bold flex items-center justify-center gap-2 hover:opacity-92 transition-opacity cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
