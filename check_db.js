import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_FIREBASE_API_KEY : process.env.VITE_FIREBASE_API_KEY,
  authDomain: "oppurtunity-os.firebaseapp.com",
  projectId: "oppurtunity-os",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const snap = await getDocs(collection(db, 'opportunities'));
  console.log("Opportunities count:", snap.size);
  if (snap.size > 0) {
      console.log("Sample:", snap.docs[0].data().title);
  }
}
check();
