import { createContext, useContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

import auth from "./Firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // clock logic
  const [clockDrift, setClockDrift] = useState(0);

  // This function fetches the actual UTC time and calculates the clock drift
  const fetchClockDrift = async () => {
    try {
      let response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC.json");
      let data = await response.json();
      let actualTime = data.unixtime * 1000; // Convert to milliseconds
      setClockDrift(actualTime - Date.now());
    } catch (error) {
      console.error("Error fetching UTC time:", error);
    }
  };

  // This function returns the adjusted UTC time based on the clock drift
  const utcTime = () => {
    return Date.now() + clockDrift;
  };

  useEffect(() => {
    // Fetch clock drift when the component mounts
    fetchClockDrift();
  }, []);

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function setUsername(username) {
    return updateProfile(auth.currentUser, {
      displayName: username,
    });
  }

  async function loginOrSignUp(email, password) {
    try {
      await login(email, password);
      return { status: true };
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-login-credentials" ||
        "auth/invalid-credential"
      ) {
        try {
          await register(email, password);
          return { status: true };
        } catch (signupError) {
          console.error(signupError);
          return { status: false, message: signupError.message };
        }
      } else {
        console.error(error);
        let errorMessage = "An error occurred during login.";
        if (error.code === "auth/wrong-password") {
          errorMessage = "Wrong password.";
        } else {
          errorMessage = error.message;
        }
        return { status: false, message: errorMessage };
      }
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
    loginOrSignUp,
    setUsername,
    utcTime,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
