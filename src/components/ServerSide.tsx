"use client";

import { useState } from "react";

interface ServerResizeProps {
  compressedFile: File | null;
  originalSize: number | null;
  onresized: (data: any) => void;
}

export default function ServerResize({
  compressedFile,
  originalSize,
  onresized
}: ServerResizeProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleResize = async () => {
    if (!compressedFile) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/server-resize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
      onresized(data);
    } catch (error) {
      console.error("Error during server resize:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Step 2: Server Side Resize</h2>
      <p className="text-gray-500 mb-6">Generate Thumbnail 300x300</p>

      <button
        onClick={handleResize}
        disabled={loading || !compressedFile}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
      >
        {loading ? "Proses Resize..." : "Generate Thumbnail"}
      </button>

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Compressed Image</h3>
            <img
              src={result.originalUrl}
              alt="Compressed"
              className="w-full h-64 object-contain rounded bg-gray-50"
            />
            <p className="mt-3 text-sm text-gray-600">
              Size: {formatBytes(result.sizes.compressed)}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Thumbnail 300x300</h3>
            <img
              src={result.thumbnailUrl}
              alt="Thumbnail"
              className="w-full h-64 object-contain rounded bg-gray-50"
            />
            <p className="mt-3 text-sm text-gray-600">
              Size: {formatBytes(result.sizes.thumbnail)}
            </p>
            <p className="text-sm text-green-600 font-medium">
              -{(
                (1 - result.sizes.thumbnail / result.sizes.compressed) *
                100
              ).toFixed(1)}
              % dari ukuran compressed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}