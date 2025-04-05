import React, { useState, useRef } from "react";
import Lottie from "lottie-react";
import animation1 from "./assets/ani1.json";
import animation3 from "./assets/ani3.json";

export default function App() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setStatus("Processing");
    const formData = new FormData();
    formData.append("statement", file);

    try {
      const res = await fetch("https://standardizerbackend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
      const name = data.downloadUrl.split("/").pop();
      setFileName(name);
      setStatus("successful");

      setFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      setStatus("Failed to process file");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 text-green-100 p-6 sm:p-10 flex justify-center items-center">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-gray-900 rounded-3xl shadow-2xl border border-gray-700">
        <div className="lg:w-3/5 w-full py-12 sm:py-20 px-6 flex flex-col justify-center space-y-12 sm:space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl text-green-100 font-oleo">
              Credit Card Statement Standardizer
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 ">
              Drag & drop your bank's CSV and get a clean, standard format
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full sm:w-4/5 border border-blue-300 bg-gray-500 rounded-xl px-4 py-2 file:mr-5 file:py-2 file:px-5 file:rounded-xl file:border-0 file:bg-blue-700 file:text-green-200 hover:file:bg-blue-600 cursor-pointer transition"
            />

            <button
              onClick={handleUpload}
              disabled={!file}
              className={`w-2/5 sm:w-1/3 py-3 rounded-xl text-green-200 text-xl transition font-oleo tracking-wide ${
                file
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Upload & Standardize
            </button>
            
            {status === "Processing" && (
              <div className="flex items-center">
                <Lottie
                  animationData={animation3}
                  loop
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
                <span className="text-green-200 text-xl ml-4">Processing...</span>
              </div>
            )}
            
            {status === "successful" && downloadUrl && (
              <div className="flex items-center gap-4">
                <Lottie
                  animationData={animation3}
                  loop={false}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
                <a
                  href={downloadUrl}
                  download
                  className="text-green-400 font-semibold underline hover:text-green-500 transition"
                >
                  Download <span className="font-mono">{fileName}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-2/5 w-full flex items-center justify-center p-6 sm:p-10">
          <Lottie
            animationData={animation1}
            loop
            className="h-full max-h-[70vh] sm:max-h-[90vh] w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
