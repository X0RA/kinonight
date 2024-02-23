import React, { createContext, useEffect, useState, useRef, useContext } from "react";
import { getDatabase, ref, onValue, set, onDisconnect, off, remove, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import auth from "./Firebase";

const UserStateContext = createContext();

export const useUserStatus = () => {
  return useContext(UserStateContext);
};

const useUserPresence = (chosenRoom) => {
  const chosenRoomRef = useRef(chosenRoom);

  useEffect(() => {
    const db = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        if (chosenRoom) {
          const userStatusDatabaseRef = ref(db, `/rooms/${chosenRoom}/users/${uid}`);

          const isOnlineForDatabase = {
            state: "online",
            username: user.displayName || user.email.split("@")[0],
            last_changed: Date.now(),
          };

          set(userStatusDatabaseRef, isOnlineForDatabase);

          onValue(ref(db, ".info/connected"), (snapshot) => {
            if (snapshot.val() === false) {
              return;
            }

            const presenceRef = ref(db, `/rooms/${chosenRoom}/users/${uid}/state`);

            onDisconnect(presenceRef)
              .set("offline") // Set state to 'offline' on disconnect
              .catch((error) => {
                console.log("Error setting user status to offline: ", error);
              });
          });
        } else if (chosenRoomRef.current) {
          // If chosenRoom is updated to null, remove the user presence from the previous room
          const presenceRef = ref(db, `/rooms/${chosenRoomRef.current}/users/${uid}`);

          remove(presenceRef).catch((error) => {
            console.log("Error removing user status: ", error);
          });
        }

        chosenRoomRef.current = chosenRoom; // Update the ref to the current chosenRoom
      }
    });
  }, [auth, chosenRoom]);
};

const useRoomUsers = (chosenRoom) => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    if (chosenRoom) {
      const db = getDatabase();
      const roomUsersRef = ref(db, `/rooms/${chosenRoom}/users/`);

      const listener = onValue(roomUsersRef, (snapshot) => {
        const users = snapshot.val();
        const connected = [];

        for (let userId in users) {
          if (users[userId].state === "online") {
            connected.push(users[userId].username);
          }
        }

        setConnectedUsers(connected);
      });

      // Clean up listener on unmount
      return () => off(roomUsersRef, "value", listener);
    }
  }, [chosenRoom]);

  return connectedUsers;
};

const useSetVideoInfo = (chosenRoom, newInfo) => {
  useEffect(() => {
    if (chosenRoom && newInfo) {
      const db = getDatabase();
      const videoInfoRef = ref(db, `/rooms/${chosenRoom}/video_info`);
      update(videoInfoRef, newInfo).catch((error) => {
        console.log("Error updating room info: ", error);
      });
    }
  }, [chosenRoom, newInfo]);
};

const useGetVideoInfo = (chosenRoom, callback) => {
  useEffect(() => {
    if (chosenRoom && callback) {
      const db = getDatabase();
      const videoInfoRef = ref(db, `/rooms/${chosenRoom}/video_info`);

      onValue(videoInfoRef, (snapshot) => {
        let videoInfo = snapshot.val();
        if (videoInfo === null) {
          videoInfo = {};
        }
        callback(videoInfo);
      });

      // Clean up listener on unmount
      return () => off(videoInfoRef, "value");
    }
  }, [chosenRoom, callback]);
};

const useSetVideoState = (chosenRoom, newInfo) => {
  useEffect(() => {
    if (chosenRoom && newInfo) {
      const db = getDatabase();
      const roomStateRef = ref(db, `/rooms/${chosenRoom}/video_state`);

      update(roomStateRef, newInfo).catch((error) => {
        console.log("Error updating room info: ", error);
      });
    }
  }, [chosenRoom, newInfo]);
};

const useGetVideoState = (chosenRoom, callback) => {
  useEffect(() => {
    if (chosenRoom && callback) {
      const db = getDatabase();
      const roomStateRef = ref(db, `/rooms/${chosenRoom}/video_state`);

      onValue(roomStateRef, (snapshot) => {
        let roomState = snapshot.val();
        // Check if roomState is null and replace it with an empty object
        if (roomState === null) {
          roomState = {};
        }
        callback(roomState);
      });

      // Clean up listener on unmount
      return () => off(roomStateRef, "value");
    }
  }, [chosenRoom, callback]);
};

const useSetRoomInfo = (chosenRoom, newInfo) => {
  useEffect(() => {
    if (chosenRoom && newInfo) {
      const db = getDatabase();
      const roomInfoRef = ref(db, `/rooms/${chosenRoom}/room_info`);

      update(roomInfoRef, newInfo).catch((error) => {
        console.log("Error updating room info: ", error);
      });
    }
  }, [chosenRoom, newInfo]);
};

const useGetRoomInfo = (chosenRoom, callback) => {
  useEffect(() => {
    if (chosenRoom && callback) {
      const db = getDatabase();
      const roomInfoRef = ref(db, `/rooms/${chosenRoom}/room_info`);

      onValue(roomInfoRef, (snapshot) => {
        let roomInfo = snapshot.val();
        // Check if roomInfo is null and replace it with an empty object
        if (roomInfo === null) {
          roomInfo = {};
        }
        callback(roomInfo);
      });

      // Clean up listener on unmount
      return () => off(roomInfoRef, "value");
    }
  }, [chosenRoom, callback]);
};

export const UserStateProvider = ({ children }) => {
  const [chosenRoom, setChosenRoom] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [videoState, setVideoState] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [videoOptions, setVideoOptions] = useState(null);

  // shows the users in the room
  useUserPresence(chosenRoom);
  const connectedUsers = useRoomUsers(chosenRoom);

  // video info is the url and subtitles
  useSetVideoInfo(chosenRoom, videoInfo);
  useGetVideoInfo(chosenRoom, setVideoInfo);
  // video state is the current time and play/pause
  useSetVideoState(chosenRoom, videoState);
  useGetVideoState(chosenRoom, setVideoState);
  // room info is the emoji handler and messages, password etc.
  useSetRoomInfo(chosenRoom, roomInfo);
  useGetRoomInfo(chosenRoom, setRoomInfo);

  const value = {
    chosenRoom,
    setChosenRoom,
    connectedUsers,
    videoInfo,
    videoOptions,
    setVideoOptions,
    setVideoInfo,
    roomState,
    setRoomState,
    videoState,
    setVideoState,
    roomInfo,
    setRoomInfo,
  };

  return <UserStateContext.Provider value={value}>{children}</UserStateContext.Provider>;
};
