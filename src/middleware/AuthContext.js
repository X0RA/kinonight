import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

import auth from "./Firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginOrSignUp(email, password) {
    try {
      try {
        await login(email, password);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          await register(email, password);
        } else {
          throw error;
        }
      }
      return { status: true };
    } catch (error) {
      console.error(error); // Optionally log the error.

      let errorMessage = "An error occurred.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Account does not exist.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Wrong password.";
      } // Add more conditions for other error codes if needed.

      return { status: false, message: errorMessage };
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loginOrSignUp, // add this line
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
