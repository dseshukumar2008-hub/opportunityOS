import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "oppurtunity-os.firebaseapp.com",
  projectId: "oppurtunity-os",
  storageBucket: "oppurtunity-os.firebasestorage.app",
  messagingSenderId: "215288495625",
  appId: "1:215288495625:web:a4a5bc8c0a3a5b481642d8"
};

// Initialize Firebase safely for HMR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore with persistent cache
// If it's already initialized (HMR), we use getFirestore to prevent the duplicate options error
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (e) {
  if (e.message.includes('has already been called')) {
    firestoreDb = getFirestore(app);
  } else {
    throw e;
  }
}
export const db = firestoreDb;


// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
