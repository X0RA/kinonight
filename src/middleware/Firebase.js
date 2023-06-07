import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set, onDisconnect } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeHgLFSWCEnMJNAdX3c3ZUpl9DkTKSJp4",
  authDomain: "movietinder-aed43.firebaseapp.com",
  databaseURL: "https://movietinder-aed43-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "movietinder-aed43",
  storageBucket: "movietinder-aed43.appspot.com",
  messagingSenderId: "1053985809671",
  appId: "1:1053985809671:web:975387d104507d7b73d1a2",
};

const app = initializeApp(firebaseConfig);

// gives us an auth instance
const auth = getAuth(app);

// Initialize the Firebase Real-time Database
const db = getDatabase();

// in order to use this auth instance elsewhere
export default auth;

export { db };
