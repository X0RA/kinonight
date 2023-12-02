import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const storage = getStorage();

export async function downloadFile(pathToFile) {
  const fileRef = ref(storage, pathToFile);

  try {
    const url = await getDownloadURL(fileRef);
    return url; // Return the download URL directly
  } catch (error) {
    // Handle any errors
    throw error;
  }
}

export async function uploadFile(pathToFile, file) {
  const fileRef = ref(storage, pathToFile);

  try {
    const uploadTask = uploadBytesResumable(fileRef, file);

    // Return a promise that resolves with the download URL upon successful upload
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Update progress (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          reject(error); // Handle unsuccessful uploads
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Resolve with the download URL
        }
      );
    });
  } catch (error) {
    // Handle errors in setting up the upload task
    throw error;
  }
}
