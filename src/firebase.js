import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ভিটের স্ট্যান্ডার্ড এনভায়রনমেন্ট ভেরিয়েবল দ্বারা কনফিগারেশন সেটআপ করা হয়েছে
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// ফায়ারবেস অ্যাপ ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);

// প্রয়োজনীয় সার্ভিসগুলো এক্সপোর্ট করা হচ্ছে
export const auth = getAuth(app);
export const db = getFirestore(app);