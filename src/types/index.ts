export interface ScheduleItem {
  date: string; // YYYY-MM-DD
  day: string;
  test1_subject: string;
  test1_portion: string;
  test2_subject: string | null;
  test2_portion: string | null;
  fat_subject: string | null;
  fat_portion: string | null;
}

export interface SectionDailySession {
  date: string;
  day: string;
  sections: {
    [sectionKey: string]: {
      fn: string; // e.g. "MAT-8" or "CHE"
      an: string; // e.g. "FL-5" or "BIO-3"
    };
  };
  funwork: string;
  fat: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  classSection: string;
}

export interface SessionMeta {
  pdf?: string;
  score?: string;
  notes?: string;
}

export type SessionMarksMap = Record<string, number>;

export type SessionCellStatus = 'non-conducted' | 'pending' | 'entered';

export interface SubjectSessionCell {
  code: string;
  subjectKey: string;
  subjectName: string;
  sessionNumber: number;
  topic: string;
  scheduledDate: string | null;
  maxMarks: number;
  enteredMarks: number | null;
  status: SessionCellStatus;
}

export interface SubjectAnalyticsSummary {
  subjectKey: string;
  subjectName: string;
  totalSessions: number;
  conductedSessions: number;
  enteredSessions: number;
  marksSecured: number;
  totalPossibleEntered: number;
  totalSubjectMax: number;
  averagePercent: number | null;
  cells: SubjectSessionCell[];
}

export interface OverallAnalyticsSummary {
  overallAveragePercent: number | null;
  totalMarksSecured: number;
  totalPossibleEntered: number;
  totalEnteredSessions: number;
  totalConductedSessions: number;
  totalSessions: number;
  subjects: SubjectAnalyticsSummary[];
}
