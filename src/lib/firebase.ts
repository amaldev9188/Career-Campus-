import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  writeBatch 
} from 'firebase/firestore';
import { collegesData } from '../data/colleges';
import { baselineDeadlines } from '../data/resources';

// Safe helper to fetch environment variables across environments (Vite client-side & Node / serverless)
const getEnvVar = (key: string): string => {
  let val = '';
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    val = (import.meta as any).env[key];
  } else if (typeof process !== 'undefined' && process.env && process.env[key]) {
    val = process.env[key];
  }
  
  if (!val) return '';
  val = val.trim();
  
  // Remove wrapping quotes if any
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1).trim();
  }
  
  const lower = val.toLowerCase();
  if (
    !val ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower.includes('your_') ||
    lower.includes('placeholder')
  ) {
    return '';
  }
  
  return val;
};

// Default stable configurations from firebase-applet-config.json
const defaultAppletConfig = {
  apiKey: "AIzaSyAJoEYfsxti0uQjTeKqCWF8S7QmPC9z5Vo",
  authDomain: "gen-lang-client-0802308240.firebaseapp.com",
  projectId: "gen-lang-client-0802308240",
  storageBucket: "gen-lang-client-0802308240.firebasestorage.app",
  messagingSenderId: "229288607872",
  appId: "1:229288607872:web:b2c118a9a4a880aef26665",
  databaseId: "ai-studio-careercompassker-616bebe8-d704-49e0-a7ef-1d77ebdb9c97"
};

// Helper to validate whether we have a complete and valid production Firebase config in the environment
const checkEnvConfigValid = (): boolean => {
  const apiKey = getEnvVar('VITE_FIREBASE_API_KEY');
  const projectId = getEnvVar('VITE_FIREBASE_PROJECT_ID');
  const appId = getEnvVar('VITE_FIREBASE_APP_ID');

  // Must have a real Google API key starting with AIza and being long enough
  if (!apiKey || !apiKey.startsWith('AIza') || apiKey.length < 20) {
    return false;
  }

  // Must have a valid-looking project ID (avoid 1234, placeholders)
  if (!projectId || projectId === '1234' || projectId.includes('your_') || projectId.includes('placeholder')) {
    return false;
  }

  // Must have a valid-looking App ID (avoid 1234, placeholders)
  if (!appId || appId === '1234' || appId.includes('your_') || appId.includes('placeholder')) {
    return false;
  }

  return true;
};

const hasValidEnvConfig = checkEnvConfigValid();

// Initialize Firebase with dynamic environment override support
const firebaseConfig = {
  apiKey: hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_API_KEY') : defaultAppletConfig.apiKey,
  authDomain: (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') : '') || defaultAppletConfig.authDomain,
  projectId: (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_PROJECT_ID') : '') || defaultAppletConfig.projectId,
  storageBucket: (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') : '') || defaultAppletConfig.storageBucket,
  messagingSenderId: (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') : '') || defaultAppletConfig.messagingSenderId,
  appId: (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_APP_ID') : '') || defaultAppletConfig.appId,
};

const databaseId = (hasValidEnvConfig ? getEnvVar('VITE_FIREBASE_DATABASE_ID') : '') || defaultAppletConfig.databaseId;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Seed function to initialize Admin account and collections if they don't exist
export async function seedDatabase() {
  try {
    // 1. Seed Admin Account if not already created
    try {
      const adminEmail = 'admin@careercompass.app';
      const adminPassword = 'Admin@123';
      
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = userCredential.user;
      
      // Save Admin profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: 'System Admin',
        email: adminEmail,
        role: 'admin',
        isFirstLogin: true,
        age: 'N/A',
        district: 'Thiruvananthapuram',
        interests: ['Administration'],
        currentClass: ''
      });
      console.log('Seeded admin@careercompass.app successfully.');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        console.log('Admin auth user already exists.');
      } else if (err.code === 'auth/operation-not-allowed') {
        console.warn('Email/Password auth provider is disabled or not allowed.');
      } else {
        console.error('Error seeding admin auth:', err);
      }
    }

    // 2. Seed Colleges collection if empty
    try {
      const collegesCol = collection(db, 'colleges');
      const collegesSnapshot = await getDocs(collegesCol);
      if (collegesSnapshot.empty) {
        console.log('Seeding baseline colleges into Firestore...');
        const batch = writeBatch(db);
        collegesData.forEach((college) => {
          const collegeRef = doc(db, 'colleges', college.id);
          batch.set(collegeRef, college);
        });
        await batch.commit();
        console.log('Successfully seeded colleges.');
      } else {
        console.log('Colleges collection already contains data.');
      }
    } catch (err: any) {
      console.warn('Skipped seeding colleges or permission restricted:', err.message);
    }

    // 3. Seed Deadlines collection if empty
    try {
      const deadlinesCol = collection(db, 'deadlines');
      const deadlinesSnapshot = await getDocs(deadlinesCol);
      if (deadlinesSnapshot.empty) {
        console.log('Seeding baseline deadlines into Firestore...');
        const batch = writeBatch(db);
        baselineDeadlines.forEach((deadline) => {
          const deadlineRef = doc(db, 'deadlines', deadline.id);
          batch.set(deadlineRef, deadline);
        });
        await batch.commit();
        console.log('Successfully seeded deadlines.');
      } else {
        console.log('Deadlines collection already contains data.');
      }
    } catch (err: any) {
      console.warn('Skipped seeding deadlines or permission restricted:', err.message);
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
