import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { SECTION_TIMETABLE_DATA } from '../data/scheduleData';
import {
  splitPortionItems,
  format12Hour,
  resolveSessionSlotsForSection,
} from '../utils/companionLogic';
import { ChevronDown } from 'lucide-react';

interface TomorrowPlanViewProps {
  selectedDate: string;
  activeSection: string;
  scheduleList: ScheduleItem[];
  morningTime: string;
  eveningTime: string;
}

type PlanBoxId = 'morning' | 'afternoon' | 'fat' | 'funwork';

export const TomorrowPlanView: React.FC<TomorrowPlanViewProps> = ({
  selectedDate,
  activeSection,
  scheduleList,
  morningTime,
  eveningTime,
}) => {
  const [expandedBoxes, setExpandedBoxes] = useState<Record<PlanBoxId, boolean>>({
    morning: false,
    afternoon: false,
    fat: false,
    funwork: false,
  });

  const toggleBox = (id: PlanBoxId) => {
    setExpandedBoxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const daySchedule: ScheduleItem =
    scheduleList.find((s) => s.date === selectedDate) || {
      date: selectedDate,
      day: new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
      }),
      test1_subject: 'Revision Session',
      test1_portion: 'General Syllabus Review',
      test2_subject: null,
      test2_portion: null,
      fat_subject: null,
      fat_portion: null,
    };

  const slots = resolveSessionSlotsForSection(
    daySchedule,
    SECTION_TIMETABLE_DATA,
    activeSection
  );

  const morningItems = splitPortionItems(slots.morningPortion);
  const afternoonItems = splitPortionItems(slots.eveningPortion);
  const fatItems = splitPortionItems(slots.fatPortion);
  const funworkItems = splitPortionItems(slots.funworkPortion);

  const formattedDateShort = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    'en-IN',
    { weekday: 'short', day: '2-digit', month: 'short' }
  );

  const blocks: Array<{
    id: PlanBoxId;
    label: string;
    heading: string;
    subjectLine: string;
    timing: string;
    portions: string[];
    emptyText: string;
  }> = [
    {
      id: 'morning',
      label: `morning allotment · ${formattedDateShort}`,
      heading: `tomorrow's morning session • ${slots.morningSessionTag}`,
      subjectLine: slots.morningSubject,
      timing: format12Hour(morningTime),
      portions: morningItems,
      emptyText: 'Self-study morning block.',
    },
    {
      id: 'afternoon',
      label: 'afternoon allotment',
      heading: slots.eveningSubject
        ? `tomorrow's afternoon session • ${slots.eveningSessionTag}`
        : `tomorrow's afternoon session • none`,
      subjectLine: slots.eveningSubject || 'No afternoon test scheduled',
      timing: slots.eveningSubject ? format12Hour(eveningTime) : 'Free Slot',
      portions: afternoonItems,
      emptyText: 'No afternoon exam — consolidate morning concepts.',
    },
    {
      id: 'fat',
      label: '06:30 am mcqs & fat exam',
      heading: slots.fatIsScheduled && slots.fatCode
        ? `tomorrow's FAT exam • ${slots.fatCode}`
        : `tomorrow's FAT exam • ${slots.fatIsScheduled ? 'scheduled' : 'none'}`,
      subjectLine: slots.fatSubject,
      timing: '06:30 AM',
      portions: fatItems,
      emptyText: 'Teachers discuss daily session MCQs at 6:30 AM.',
    },
    {
      id: 'funwork',
      label: 'funwork',
      heading: 'Funwork',
      subjectLine: slots.funworkSubject,
      timing: 'Daily',
      portions: funworkItems,
      emptyText: 'Complete daily assigned practice sheet.',
    },
  ];

  return (
    <div data-testid="tomorrow-plan-view" className="space-y-3 pb-2">
      {/* Full-width Italic Display Title */}
      <h1
        data-testid="tomorrow-plan-title"
        className="w-full italic font-extrabold tracking-tight leading-none text-[var(--text)] select-none"
        style={{
          fontSize: 'clamp(1.75rem, 8vw, 3.1rem)',
        }}
      >
        TOMORROW&apos;S PLAN
      </h1>

      {/* 4 Compact Interactive Rounded-Rectangle Accordion Sections */}
      <div className="space-y-2.5">
        {blocks.map((block) => {
          const isOpen = expandedBoxes[block.id];
          return (
            <div key={block.id} className="space-y-1">
              {/* Unique Normal-Font Label */}
              <p className="px-1 text-[11px] sm:text-xs font-normal tracking-wide text-[var(--text-muted)] leading-tight">
                {block.label}
              </p>

              {/* Clickable Rounded-Rectangle Accordion Card */}
              <button
                type="button"
                aria-expanded={isOpen}
                data-testid={`plan-accordion-${block.id}`}
                onClick={() => toggleBox(block.id)}
                className="w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all duration-300 cursor-pointer overflow-hidden"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3">
                  {/* Far-Left Unboxed Animated Downwards Arrow */}
                  <span className="shrink-0 flex items-center justify-center text-[var(--accent-brand)]">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? 'rotate-180' : 'translate-y-[1px]'
                      }`}
                      strokeWidth={2.3}
                    />
                  </span>

                  {/* Left-Aligned Session Timing */}
                  <span className="shrink-0 font-mono tabular-nums text-[10.5px] sm:text-xs font-semibold text-[var(--text-secondary)]">
                    {block.timing}
                  </span>

                  {/* Heading & Subject / Session Number */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] sm:text-sm font-bold text-[var(--text)] leading-tight break-words">
                      {block.heading}
                    </div>
                    <div className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate mt-0.5 leading-tight">
                      {block.subjectLine}
                    </div>
                  </div>
                </div>

                {/* Soothing Animated Portions Drop-Down */}
                <div
                  className="accordion-panel"
                  data-open={isOpen ? 'true' : 'false'}
                >
                  <div className="accordion-inner">
                    <div className="px-4 pb-3 pt-2 border-t border-[var(--border)] bg-[var(--surface-elevated)]/55 space-y-1.5">
                      {block.portions.length > 0 ? (
                        <ul className="space-y-1 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {block.portions.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: 'var(--accent-brand)' }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                          {block.emptyText}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
