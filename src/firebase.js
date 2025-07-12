import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDtlxCyqxddWHxck3Ugfg3Ca72hmdbCXmo",
  authDomain: "skilshare-1a958.firebaseapp.com",
  databaseURL: "https://skilshare-1a958-default-rtdb.firebaseio.com",
  projectId: "skilshare-1a958",
  storageBucket: "skilshare-1a958.appspot.com", // corrected domain
  messagingSenderId: "973139023798",
  appId: "1:973139023798:web:139c1fbaa48a3fa45e9317",
  measurementId: "G-Q194MBKV8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get Realtime Database instance
const database = getDatabase(app);

export { app, analytics, database };
