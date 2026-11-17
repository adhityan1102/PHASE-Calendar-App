import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import {
  SECTION_TIMETABLE_DATA,
  SUBJECT_CODES_MAP,
  FAT_EXAMS_MAP,
  DAILY_FUNWORK_MAP,
} from '../data/scheduleData';
import {
  TIMETABLE_START_DATE,
  filterScheduleFromTimetableStart,
  normalizeSessionCode,
} from '../utils/companionLogic';
import { Search, Edit3 } from 'lucide-react';

interface FullScheduleViewProps {
  scheduleList: ScheduleItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenEditModal: () => void;
  activeSection: string;
  activeTheme: 'dark' | 'light';
}

export const FullScheduleView: React.FC<FullScheduleViewProps> = ({
  scheduleList,
  selectedDate,
  onSelectDate,
  onOpenEditModal,
  activeSection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'maths' | 'science' | 'social' | 'fat' | 'preboard'
  >('all');

  // Show dates starting strictly from 10/11/26 matching the 10A-10E PDF timetable
  const officialSchedule = filterScheduleFromTimetableStart(
    scheduleList,
    TIMETABLE_START_DATE
  );

  const filteredSchedule = officialSchedule.filter((item) => {
    const secEntry = SECTION_TIMETABLE_DATA.find((s) => s.date === item.date);
    const secSlot = secEntry?.sections[activeSection];
    const normFn = secSlot?.fn ? normalizeSessionCode(secSlot.fn) : '';
    const normAn = secSlot?.an ? normalizeSessionCode(secSlot.an) : '';
    const fnMapped = normFn
      ? SUBJECT_CODES_MAP[normFn] || SUBJECT_CODES_MAP[secSlot?.fn || '']
      : undefined;
    const anMapped = normAn
      ? SUBJECT_CODES_MAP[normAn] || SUBJECT_CODES_MAP[secSlot?.an || '']
      : undefined;

    const normFat =
      secEntry?.fat && secEntry.fat !== 'None' ? normalizeSessionCode(secEntry.fat) : '';
    const fatMapped = normFat ? FAT_EXAMS_MAP[normFat] : undefined;
    const fwMapped = DAILY_FUNWORK_MAP[item.date];

    const text = secEntry
      ? `${item.date} ${item.day} ${fnMapped?.subject || normFn} ${
          fnMapped?.topic || ''
        } ${anMapped?.subject || normAn} ${anMapped?.topic || ''} ${
          fatMapped ? `${fatMapped.subject} ${fatMapped.topic}` : ''
        } ${fwMapped ? `${fwMapped.subject} ${fwMapped.topic}` : ''}`.toLowerCase()
      : `${item.date} ${item.day} ${item.test1_subject} ${item.test1_portion} ${
          item.test2_subject || ''
        } ${item.test2_portion || ''} ${item.fat_subject || ''} ${
          item.fat_portion || ''
        }`.toLowerCase();

    if (searchQuery && !text.includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterType === 'maths' && !text.includes('math') && !text.includes('mat-'))
      return false;
    if (
      filterType === 'science' &&
      !text.includes('physics') &&
      !text.includes('chem') &&
      !text.includes('bio') &&
      !text.includes('phy') &&
      !text.includes('che')
    )
      return false;
    if (
      filterType === 'social' &&
      !text.includes('social') &&
      !text.includes('geo') &&
      !text.includes('his') &&
      !text.includes('dp-') &&
      !text.includes('eco')
    )
      return false;
    if (
      filterType === 'fat' &&
      !(secEntry ? secEntry.fat && secEntry.fat !== 'None' : text.includes('fat #') || text.includes('fat-'))
    )
      return false;
    if (
      filterType === 'preboard' &&
      !text.includes('pre final') &&
      !text.includes('pre-final')
    )
      return false;

    return true;
  });

  const clampedPickerValue =
    selectedDate >= TIMETABLE_START_DATE ? selectedDate : TIMETABLE_START_DATE;

  return (
    <div data-testid="full-schedule-view" className="space-y-4">
      {/* Filter & Search Bar */}
      <div
        className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={onOpenEditModal}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--text)] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Edit Active Day</span>
          </button>

          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-medium">
            {[
              { id: 'all', label: 'All' },
              { id: 'maths', label: 'Maths' },
              { id: 'science', label: 'Science' },
              { id: 'social', label: 'Social' },
              { id: 'fat', label: 'FATs' },
              { id: 'preboard', label: 'Pre-Boards' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-[var(--text)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subject, FAT, topic, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] text-xs sm:text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </div>
          <input
            type="date"
            aria-label="Jump to date"
            value={clampedPickerValue}
            min={TIMETABLE_START_DATE}
            max="2026-12-15"
            onChange={(e) => e.target.value && onSelectDate(e.target.value)}
            className="sm:w-44 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text)] font-mono text-xs sm:text-sm outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Timeline List (Starting 2026-11-10) */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {filteredSchedule.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)] text-xs sm:text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            No matching sessions found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredSchedule.map((item) => {
            const isSelected = item.date === selectedDate;
            const secEntry = SECTION_TIMETABLE_DATA.find((s) => s.date === item.date);
            const secSlot = secEntry?.sections[activeSection];

            let fnDisplay = item.test1_subject;
            let anDisplay = item.test2_subject;
            const isCompactCode = (code: string) =>
              /^(MAT|PHY|CHE|BIO|SS|FL|SL|IT)([-\s]?\d+|\/[A-Z]{2,4})?$/i.test(code.trim());
            if (secSlot?.fn && secSlot.fn !== '—') {
              const normFn = normalizeSessionCode(secSlot.fn);
              const mapped = SUBJECT_CODES_MAP[normFn] || SUBJECT_CODES_MAP[secSlot.fn];
              fnDisplay = mapped
                ? isCompactCode(secSlot.fn)
                  ? `${mapped.subject} (${normFn})`
                  : mapped.subject
                : secSlot.fn;
            }
            if (secSlot?.an && secSlot.an !== '—') {
              const normAn = normalizeSessionCode(secSlot.an);
              const mapped = SUBJECT_CODES_MAP[normAn] || SUBJECT_CODES_MAP[secSlot.an];
              anDisplay = mapped
                ? isCompactCode(secSlot.an)
                  ? `${mapped.subject} (${normAn})`
                  : mapped.subject
                : secSlot.an;
            } else if (secSlot?.an === '—') {
              anDisplay = null;
            }

            const normFat =
              secEntry?.fat && secEntry.fat !== 'None'
                ? normalizeSessionCode(secEntry.fat)
                : '';
            const fatMeta = normFat ? FAT_EXAMS_MAP[normFat] : undefined;
            const fwMeta = DAILY_FUNWORK_MAP[item.date];

            const fatLabel = secEntry
              ? secEntry.fat !== 'None'
                ? `FAT: ${fatMeta ? fatMeta.subject.replace(' (20M | 30m)', '') : normFat}`
                : fwMeta
                ? fwMeta.subject
                : `Funwork: ${secEntry.funwork}`
              : item.fat_subject;

            return (
              <button
                key={item.date}
                type="button"
                data-testid={`schedule-row-${item.date}`}
                onClick={() => onSelectDate(item.date)}
                className={`w-full text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--text)] bg-[var(--surface-elevated)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-elevated)]'
                }`}
              >
                <div className="min-w-[105px]">
                  <strong className="block font-mono tabular-nums text-xs sm:text-sm font-bold text-[var(--text)]">
                    {item.date}
                  </strong>
                  <span className="text-xs text-[var(--text-muted)]">{item.day}</span>
                </div>

                <div className="flex-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text)]">
                    Morning: {fnDisplay || 'None'}
                  </span>
                  {anDisplay && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Afternoon: {anDisplay}</span>
                    </>
                  )}
                  {fatLabel && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--text-muted)]">{fatLabel}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
