import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  onSnapshot,
  Firestore 
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { StudentProfile } from '../types';

export function resolveFirebaseConfig() {
  const env = import.meta.env;
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '',
    appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || '',
    firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || '(default)',
    recaptchaSiteKey: env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || firebaseAppletConfig.recaptchaSiteKey || '',
  };
}

let firestoreInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!firestoreInstance) {
    const firebaseConfig = resolveFirebaseConfig();
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
    firestoreInstance = getFirestore(app, databaseId);
  }
  return firestoreInstance;
}

const LOCAL_STUDENTS_KEY = 'jumbo_linux_kids_students_records';

export const STARTER_STUDENTS: StudentProfile[] = [
  {
    id: 'student_starter_1',
    name: 'Tux',
    email: 'tux@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Polar Kernel Academy',
    dreamCareer: '🐧 Linux Kernel Lead',
    grade: 'Middle School',
    avatar: '🐧',
    createdAt: '2026-09-01T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 12,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      xp: 3200,
      streakDays: 14,
      longestStreak: 14,
      badges: ['cmd_master', 'speed_demon', 'root_flag', 'xp_century', 'streak_legend'],
      commandsRunCount: 1420,
      rescueHighScore: 480,
      duelsWon: 18
    }
  },
  {
    id: 'student_starter_2',
    name: 'Jumbo',
    email: 'jumbo@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Savanna STEM Academy',
    dreamCareer: '🐘 Cloud Architect',
    grade: '5th Grade',
    avatar: '🐘',
    createdAt: '2026-09-05T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 9,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
      xp: 2150,
      streakDays: 8,
      longestStreak: 9,
      badges: ['cmd_master', 'xp_century', 'streak_legend'],
      commandsRunCount: 950,
      rescueHighScore: 320,
      duelsWon: 12
    }
  },
  {
    id: 'student_starter_3',
    name: 'Linus',
    email: 'linus@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Helsinki Tech Club',
    dreamCareer: '💻 OS Creator',
    grade: '6th Grade',
    avatar: '💻',
    createdAt: '2026-09-10T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 8,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
      completedLevels: [1, 2, 3, 4, 5, 6, 7],
      xp: 1840,
      streakDays: 6,
      longestStreak: 7,
      badges: ['cmd_master', 'xp_century', 'streak_legend'],
      commandsRunCount: 780,
      rescueHighScore: 290,
      duelsWon: 9
    }
  },
  {
    id: 'student_starter_4',
    name: 'Ninja',
    email: 'ninja@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Shadow Creek Middle',
    dreamCareer: '⚡ Cybersecurity Defender',
    grade: '7th Grade',
    avatar: '⚡',
    createdAt: '2026-09-12T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 7,
      unlockedLevels: [1, 2, 3, 4, 5, 6, 7],
      completedLevels: [1, 2, 3, 4, 5, 6],
      xp: 1520,
      streakDays: 5,
      longestStreak: 6,
      badges: ['xp_century', 'streak_legend'],
      commandsRunCount: 610,
      rescueHighScore: 240,
      duelsWon: 7
    }
  },
  {
    id: 'student_starter_5',
    name: 'Ranger',
    email: 'ranger@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Prairie Elementary',
    dreamCareer: '🚀 Space Pilot',
    grade: '4th Grade',
    avatar: '🚀',
    createdAt: '2026-09-15T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 5,
      unlockedLevels: [1, 2, 3, 4, 5],
      completedLevels: [1, 2, 3, 4],
      xp: 1100,
      streakDays: 4,
      longestStreak: 5,
      badges: ['xp_century', 'streak_legend'],
      commandsRunCount: 450,
      rescueHighScore: 190,
      duelsWon: 5
    }
  },
  {
    id: 'student_starter_6',
    name: 'Root',
    email: 'root@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Royal Oak Elementary',
    dreamCareer: '👑 AI Engineer',
    grade: '3rd Grade',
    avatar: '👑',
    createdAt: '2026-09-18T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 4,
      unlockedLevels: [1, 2, 3, 4],
      completedLevels: [1, 2, 3],
      xp: 850,
      streakDays: 3,
      longestStreak: 4,
      badges: ['streak_legend'],
      commandsRunCount: 320,
      rescueHighScore: 150,
      duelsWon: 3
    }
  },
  {
    id: 'student_starter_7',
    name: 'Pipes',
    email: 'pipes@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Bay City Elementary',
    dreamCareer: '🔧 Robotics Builder',
    grade: '4th Grade',
    avatar: '🔧',
    createdAt: '2026-09-20T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 3,
      unlockedLevels: [1, 2, 3],
      completedLevels: [1, 2],
      xp: 620,
      streakDays: 3,
      longestStreak: 3,
      badges: ['streak_legend'],
      commandsRunCount: 230,
      rescueHighScore: 110,
      duelsWon: 2
    }
  },
  {
    id: 'student_starter_8',
    name: 'Fox',
    email: 'fox@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Redwood Valley School',
    dreamCareer: '🦊 Game Developer',
    grade: '5th Grade',
    avatar: '🦊',
    createdAt: '2026-09-22T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 3,
      unlockedLevels: [1, 2, 3],
      completedLevels: [1, 2],
      xp: 510,
      streakDays: 2,
      longestStreak: 2,
      badges: [],
      commandsRunCount: 190,
      rescueHighScore: 95,
      duelsWon: 2
    }
  },
  {
    id: 'student_starter_9',
    name: 'Maya',
    email: 'maya@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Starlight Academy',
    dreamCareer: '⭐ Astrophysicist',
    grade: '4th Grade',
    avatar: '⭐',
    createdAt: '2026-09-25T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 2,
      unlockedLevels: [1, 2],
      completedLevels: [1],
      xp: 380,
      streakDays: 2,
      longestStreak: 2,
      badges: [],
      commandsRunCount: 140,
      rescueHighScore: 70,
      duelsWon: 1
    }
  },
  {
    id: 'student_starter_10',
    name: 'Panda',
    email: 'panda@jumbolinux.kids',
    authType: 'built_in_email',
    pin: '1234',
    school: 'Bamboo Forest School',
    dreamCareer: '🐼 Data Scientist',
    grade: '3rd Grade',
    avatar: '🐼',
    createdAt: '2026-09-28T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    progress: {
      currentLevel: 2,
      unlockedLevels: [1, 2],
      completedLevels: [1],
      xp: 260,
      streakDays: 1,
      longestStreak: 2,
      badges: [],
      commandsRunCount: 95,
      rescueHighScore: 50,
      duelsWon: 1
    }
  }
];

export async function saveStudentToFirestore(student: StudentProfile): Promise<void> {
  // Always update local cache first for instant responsiveness
  try {
    const cachedRaw = localStorage.getItem(LOCAL_STUDENTS_KEY);
    const cached: StudentProfile[] = cachedRaw ? JSON.parse(cachedRaw) : [];
    const idx = cached.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      cached[idx] = student;
    } else {
      cached.push(student);
    }
    localStorage.setItem(LOCAL_STUDENTS_KEY, JSON.stringify(cached));
  } catch (err) {
    console.warn('Local cache write error:', err);
  }

  // Persist to Cloud Firestore
  try {
    const db = getDb();
    const studentRef = doc(db, 'students', student.id);
    await setDoc(studentRef, {
      ...student,
      xp: student.progress?.xp ?? 0,
      streakDays: student.progress?.streakDays ?? 1,
      lastActiveAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore write warning (saved locally):', err);
  }
}

export async function loadStudents(): Promise<StudentProfile[]> {
  const localList: StudentProfile[] = [];
  try {
    const cachedRaw = localStorage.getItem(LOCAL_STUDENTS_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw);
      if (Array.isArray(parsed)) {
        localList.push(...parsed);
      }
    }
  } catch {
    // ignore
  }

  try {
    const db = getDb();
    const studentsCol = collection(db, 'students');
    const snapshot = await getDocs(studentsCol);
    if (!snapshot.empty) {
      const remoteList: StudentProfile[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as StudentProfile;
        if (data && data.id) {
          remoteList.push(data);
        }
      });

      if (remoteList.length > 0) {
        // Merge with local list (prefer remote, add any local missing)
        const combinedMap = new Map<string, StudentProfile>();
        localList.forEach(s => combinedMap.set(s.id, s));
        remoteList.forEach(s => combinedMap.set(s.id, s));
        const merged = Array.from(combinedMap.values());
        localStorage.setItem(LOCAL_STUDENTS_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (err) {
    console.warn('Firestore load warning, using local students:', err);
  }

  return localList;
}

export async function findStudentByLogin(identifier: string, pin: string): Promise<StudentProfile | null> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pin.trim().toLowerCase();
  const students = await loadStudents();

  return students.find(s => {
    const emailMatch = s.email && s.email.toLowerCase() === cleanId;
    const nameMatch = s.name && s.name.toLowerCase() === cleanId;
    const builtInMatch = cleanId.includes('@') 
      ? s.email.toLowerCase() === cleanId 
      : s.email.toLowerCase().startsWith(cleanId + '@');

    const matchesIdentity = emailMatch || nameMatch || builtInMatch;
    const matchesPin = (s.pin || '').toLowerCase() === cleanPin;
    return matchesIdentity && matchesPin;
  }) || null;
}

/**
 * Seeds starter students to Firestore if the students collection is empty.
 */
let hasSeededStarterPromise: Promise<void> | null = null;
export async function seedStarterStudentsIfEmpty(): Promise<void> {
  if (hasSeededStarterPromise) return hasSeededStarterPromise;

  hasSeededStarterPromise = (async () => {
    try {
      const db = getDb();
      const studentsCol = collection(db, 'students');
      const snap = await getDocs(studentsCol);
      if (snap.empty) {
        for (const starter of STARTER_STUDENTS) {
          const sRef = doc(db, 'students', starter.id);
          await setDoc(sRef, {
            ...starter,
            xp: starter.progress.xp,
            streakDays: starter.progress.streakDays,
            lastActiveAt: new Date().toISOString()
          }, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Starter students seed warning (will use local starters):', err);
    }
  })();

  return hasSeededStarterPromise;
}

/**
 * Subscribes in real-time to the Firestore 'students' collection.
 * Automatically sorts students and delivers the top N students to the callback.
 * Returns an unsubscribe function.
 */
export function subscribeToLeaderboard(
  onUpdate: (topStudents: StudentProfile[], isConnected: boolean) => void,
  limitCount: number = 10,
  sortBy: 'xp' | 'streak' = 'xp'
): () => void {
  let isUnsubscribed = false;

  // Immediately invoke with local cache / starter fallback for instant rendering
  const getCombinedAndSorted = (firestoreStudents: StudentProfile[]): StudentProfile[] => {
    const map = new Map<string, StudentProfile>();

    // Seed defaults
    STARTER_STUDENTS.forEach(s => map.set(s.id, s));

    // Overlay cached local students
    try {
      const cachedRaw = localStorage.getItem(LOCAL_STUDENTS_KEY);
      if (cachedRaw) {
        const parsed: StudentProfile[] = JSON.parse(cachedRaw);
        if (Array.isArray(parsed)) {
          parsed.forEach(s => map.set(s.id, s));
        }
      }
    } catch {
      // ignore
    }

    // Overlay live Firestore students
    firestoreStudents.forEach(s => {
      if (s && s.id) {
        map.set(s.id, s);
      }
    });

    const all = Array.from(map.values());

    all.sort((a, b) => {
      if (sortBy === 'streak') {
        const sA = a.progress?.streakDays ?? 1;
        const sB = b.progress?.streakDays ?? 1;
        if (sB !== sA) return sB - sA;
      }
      const xpA = a.progress?.xp ?? (a as any).xp ?? 0;
      const xpB = b.progress?.xp ?? (b as any).xp ?? 0;
      if (xpB !== xpA) return xpB - xpA;
      const lvlA = a.progress?.currentLevel ?? 1;
      const lvlB = b.progress?.currentLevel ?? 1;
      if (lvlB !== lvlA) return lvlB - lvlA;
      const bA = (a.progress?.badges || []).length;
      const bB = (b.progress?.badges || []).length;
      return bB - bA;
    });

    return all.slice(0, limitCount);
  };

  // Immediate callback with current known state
  onUpdate(getCombinedAndSorted([]), false);

  // Trigger optional background seed
  seedStarterStudentsIfEmpty().catch(() => {});

  try {
    const db = getDb();
    const studentsCol = collection(db, 'students');

    const unsubscribe = onSnapshot(
      studentsCol,
      (snapshot) => {
        if (isUnsubscribed) return;
        const remoteList: StudentProfile[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StudentProfile;
          if (data && (data.id || data.name)) {
            remoteList.push(data);
          }
        });

        // Update local storage cache
        try {
          const cachedRaw = localStorage.getItem(LOCAL_STUDENTS_KEY);
          const cached: StudentProfile[] = cachedRaw ? JSON.parse(cachedRaw) : [];
          const mergedMap = new Map<string, StudentProfile>();
          cached.forEach(s => mergedMap.set(s.id, s));
          remoteList.forEach(s => mergedMap.set(s.id, s));
          localStorage.setItem(LOCAL_STUDENTS_KEY, JSON.stringify(Array.from(mergedMap.values())));
        } catch {
          // ignore
        }

        const top = getCombinedAndSorted(remoteList);
        onUpdate(top, true);
      },
      (err) => {
        console.warn('Real-time leaderboard snapshot warning (using cached data):', err);
        if (!isUnsubscribed) {
          onUpdate(getCombinedAndSorted([]), false);
        }
      }
    );

    return () => {
      isUnsubscribed = true;
      unsubscribe();
    };
  } catch (err) {
    console.warn('Failed to initialize Firestore listener:', err);
    return () => {
      isUnsubscribed = true;
    };
  }
}

