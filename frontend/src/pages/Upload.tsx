import { useState } from "react";
import { screenshotService } from "../services/screenshotService";
export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [captureTime, setCaptureTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }
    setUploading(true);
    setMessage("");

    try {
      await screenshotService.upload(file, new Date(captureTime));
      setMessage("Screenshot uploaded successfully!");
      setFile(null);
      setCaptureTime(new Date().toISOString().slice(0, 16));

      // Reset file input
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Upload Screenshot
        </h1>
        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-400"
                : "bg-red-50 text-red-700 border border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot File
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: PNG, JPG, JPEG (Max 10MB)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capture Time
            </label>
            <input
              type="datetime-local"
              value={captureTime}
              onChange={(e) => setCaptureTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {file && (
            <div className="border border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">Preview:</p>
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload Screenshot"}
          </button>
        </form>
      </div>
    </div>
  );
};
