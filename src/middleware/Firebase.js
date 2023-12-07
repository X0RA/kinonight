import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBYykXDfsZCaGlPCriFRI5pwyJwXG_QuhI",
  authDomain: "xkiinonight.firebaseapp.com",
  databaseURL: "https://xkiinonight-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xkiinonight",
  storageBucket: "xkiinonight.appspot.com",
  messagingSenderId: "706285262897",
  appId: "1:706285262897:web:6ed5fc8b534c82e6991d10",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
export default auth;
export { db };
