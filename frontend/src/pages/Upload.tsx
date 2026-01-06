import { useState } from "react";
import { screenshotService } from "../services/screenshotService";

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a screenshot");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const res = await screenshotService.upload(file);

      setMessage("Screenshot uploaded successfully!");
      setFile(null);

      const input = document.getElementById("file-input") as HTMLInputElement;
      if (input) input.value = "";
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Screenshot</h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
          />

          {file && (
            <img
              src={URL.createObjectURL(file)}
              className="rounded border max-h-64"
            />
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};
