import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  orderBy,
  query,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { OverallAnalyticsSummary, SessionMarksMap } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const OWNER_EMAIL_SHA256 =
  '9975c39d055770cefda70a5bdf5ca54892de5bd2c52c66a063f3dddf932648dd';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate live server connectivity on boot per Firebase integration requirements
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

export async function checkIsOwnerEmail(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  try {
    const normalized = email.trim().toLowerCase();
    const msgBuffer = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === OWNER_EMAIL_SHA256;
  } catch (_) {
    return false;
  }
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export interface CloudMarksSubmissionRecord {
  id: string;
  uid: string;
  studentName: string;
  studentEmail: string;
  classSection: string;
  marks: SessionMarksMap;
  totalMarksSecured: number;
  totalPossibleEntered: number;
  enteredCount: number;
  averagePercent: number;
  updatedAtIso: string | null;
}

export async function syncMarksSubmissionToCloud(params: {
  studentName: string;
  classSection: string;
  marks: SessionMarksMap;
  summary: OverallAnalyticsSummary;
}): Promise<{ ok: boolean; reason?: string }> {
  const user = auth.currentUser;
  if (!user || !user.email || !user.emailVerified) {
    return { ok: false, reason: 'auth-required' };
  }

  const cleanSection = ['10A', '10B', '10C', '10D', '10E'].includes(params.classSection)
    ? params.classSection
    : '10A';
  const cleanName = (params.studentName || user.displayName || 'Student').trim().slice(0, 80);
  const cleanEmail = user.email.trim().slice(0, 120);

  // Sanitize marks map strictly to numeric scores 0..30
  const sanitizedMarks: Record<string, number> = {};
  for (const [key, val] of Object.entries(params.marks)) {
    if (typeof val === 'number' && !Number.isNaN(val) && val >= 0 && val <= 30) {
      sanitizedMarks[key] = val;
    }
  }

  const docPath = `marks_submissions/${user.uid}`;
  const docRef = doc(db, 'marks_submissions', user.uid);

  let existingCreatedAt: unknown = null;
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      existingCreatedAt = snap.data().createdAt;
    }
  } catch (err) {
    // Doc might not exist yet or initial write will create it
  }

  const payload = {
    uid: user.uid,
    studentName: cleanName,
    studentEmail: cleanEmail,
    classSection: cleanSection,
    marks: sanitizedMarks,
    totalMarksSecured: Math.round(params.summary.totalMarksSecured * 10) / 10,
    totalPossibleEntered: Math.round(params.summary.totalPossibleEntered * 10) / 10,
    enteredCount: Math.min(66, Math.max(0, Math.round(params.summary.totalEnteredSessions))),
    averagePercent:
      params.summary.overallAveragePercent !== null
        ? Math.round(params.summary.overallAveragePercent * 10) / 10
        : 0,
    createdAt: existingCreatedAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
    return { ok: true };
  } catch (error) {
    handleFirestoreError(error, existingCreatedAt ? OperationType.UPDATE : OperationType.CREATE, docPath);
  }
}

export async function fetchAllStudentMarksForOwner(): Promise<CloudMarksSubmissionRecord[]> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) {
    return [];
  }

  const isOwner = await checkIsOwnerEmail(user.email);
  if (!isOwner) {
    return [];
  }

  const collectionPath = 'marks_submissions';
  try {
    const q = query(collection(db, collectionPath), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      let updatedAtIso: string | null = null;
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        updatedAtIso = data.updatedAt.toDate().toISOString();
      }
      return {
        id: d.id,
        uid: String(data.uid || d.id),
        studentName: String(data.studentName || 'Student'),
        studentEmail: String(data.studentEmail || ''),
        classSection: String(data.classSection || '10A'),
        marks: (data.marks || {}) as SessionMarksMap,
        totalMarksSecured: Number(data.totalMarksSecured || 0),
        totalPossibleEntered: Number(data.totalPossibleEntered || 0),
        enteredCount: Number(data.enteredCount || 0),
        averagePercent: Number(data.averagePercent || 0),
        updatedAtIso,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}
