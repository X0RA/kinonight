import React, { useState } from "react";
import { uploadFile } from "../middleware/Storage";

export default function SubtitleUploadPage() {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection for subtitles
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to upload the subtitle file
  const uploadSubtitleFile = async (file) => {
    setIsUploading(true);
    try {
      const path = `subtitles/${file.name}`; // Define the path where the file will be stored
      const url = await uploadFile(path, file); // Upload the file
      setUploadUrl(url); // Set the upload URL
    } catch (error) {
      console.error("Failed to upload file:", error);
      setUploadUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle the upload button click
  const handleUpload = async () => {
    if (file) {
      await uploadSubtitleFile(file);
    } else {
      alert("Please select a file to upload");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-primary-400">
      <div className="bg-slate-100 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-primary-400 mb-4">Upload Subtitles</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          className="mt-4 px-6 py-2 bg-primary-500 text-white rounded hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-500"
          onClick={handleUpload}
          disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {uploadUrl && (
          <div className="mt-4 text-primary-400">
            <p>Subtitle URL:</p>
            <a
              href={uploadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-blue-700 hover:underline">
              {uploadUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
