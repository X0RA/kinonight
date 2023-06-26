import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const storage = getStorage();

export async function downloadFile(pathToFile) {
  const fileRef = ref(storage, pathToFile);

  return new Promise((resolve, reject) => {
    getDownloadURL(fileRef)
      .then((url) => {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = (event) => {
          var blob = xhr.response;
          resolve(blob);
        };
        xhr.open("GET", url);
        xhr.send();
      })
      .catch((error) => {
        // Handle any errors
        reject(error);
      });
  });
}

export async function uploadFile(pathToFile, file) {
  const fileRef = ref(storage, pathToFile);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You could use this observer to display upload progress to the user
      },
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // Once the file is uploaded, we want to get its download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}
