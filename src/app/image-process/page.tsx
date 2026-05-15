"use client";

import { useState } from "react";
import ClientCompression from "@/components/ClientCompression";
import ServerResize from "@/components/ServerSide";
import WebPConversion from "@/components/WebPConversion";

export default function ImageProcessPage() {
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resizedFile, setResizedFile] = useState<any | null>(null);

  const handleCompressed = (file: File, originalSize: number) => {
    setCompressedFile(file);
    setOriginalSize(originalSize);
    setResizedFile(null);
  };

  const handleResized = (data: any) => {
    setResizedFile(data);
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Image Optimizer
        </h1>

        <ClientCompression onCompressed={handleCompressed} />
        {compressedFile && (
          <ServerResize
            compressedFile={compressedFile}
            originalSize={originalSize}
            onresized={handleResized}
          />
        )}
        {resizedFile && compressedFile && (
          <WebPConversion
            compressedFile={compressedFile}
            resizeData={resizedFile}
          />
        )}
      </div>
    </main>
  );
}