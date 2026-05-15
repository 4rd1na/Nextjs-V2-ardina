"use client";

import { useState } from "react";
import Link from "next/link";

type Icon = {
  name: string;
  col: number;
  row: number;
  offsetX: number;
  offsetY: number;
  color: string;
}

export default function SpritePage() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);

  const sosialIcons: Icon[] = [
    { name: "Facebook", col: 0, row: 0, offsetX: 45, offsetY: 45, color: "#1877F2" },
    { name: "Twitter", col: 1, row: 0, offsetX: 20, offsetY: 45, color: "#1DA1F2" },
    { name: "Instagram", col: 2, row: 0, offsetX: -5, offsetY: 45, color: "#E4405F" },
    { name: "Skype", col: 3, row: 0, offsetX: -25, offsetY: 45, color: "#00AFF0" },
    { name: "WhatsApp", col: 0, row: 1, offsetX: 45, offsetY: 20, color: "#25D366" },
    { name: "Pinterest", col: 1, row: 1, offsetX: 20, offsetY: 20, color: "#E60023" },
    { name: "Dribbble", col: 2, row: 1, offsetX: -5, offsetY: 20, color: "#EA4C89" },
    { name: "Behance", col: 3, row: 1, offsetX: -25, offsetY: 20, color: "#1769FF" },
    { name: "LinkedIn", col: 0, row: 2, offsetX: 45, offsetY: 0, color: "#0A66C2" },
    { name: "Google+", col: 1, row: 2, offsetX: 20, offsetY: 0, color: "#DB4437" },
    { name: "Snapchat", col: 2, row: 2, offsetX: -5, offsetY: 0, color: "#FFFC00" },
    { name: "Vimeo", col: 3, row: 2, offsetX: -25, offsetY: 0, color: "#1AB7EA" },
    { name: "YouTube", col: 0, row: 3, offsetX: 45, offsetY: -20, color: "#FF0000" },
    { name: "Messenger", col: 1, row: 3, offsetX: 20, offsetY: -20, color: "#0084FF" },
    { name: "Codepen", col: 2, row: 3, offsetX: -5, offsetY: -20, color: "#000000" },
    { name: "RSS", col: 3, row: 3, offsetX: -25, offsetY: -20, color: "#F26522" }
  ];

  const iconSize = 100;
  const displaySize = 80;
  const previewSize = 200;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <Link href="/" className="text-indigo-600 hover:underline text-sm inline-block mb-4">
        &larr; Kembali ke Home
      </Link>

      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <h1 className="m-0 text-xl md:text-2xl font-semibold">Sosial Media Icons</h1>
        <p className="mt-2 mb-0 text-gray-600 text-sm md:text-base">Css Sprite Sheet</p>
      </div>

      {/* Icon Grid */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {sosialIcons.map((icon, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 md:gap-3 cursor-pointer"
              onMouseEnter={() => setHoveredIcon(icon.name)}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => setSelectedIcon(icon)}
              role="button"
              tabIndex={0}
            >
              <div
                className={`rounded-xl shadow-sm transition-all duration-200 ${
                  hoveredIcon === icon.name ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  width: `${displaySize}px`,
                  height: `${displaySize}px`,
                  backgroundImage: `url('/image3.jpg')`,
                  backgroundSize: `${iconSize * 4}px ${iconSize * 4}px`,
                  backgroundPosition: `-${icon.col * iconSize + icon.offsetX}px -${icon.row * iconSize + icon.offsetY}px`,
                  boxShadow: hoveredIcon === icon.name 
                    ? `0 4px 12px ${icon.color}60` 
                    : undefined
                }}
              />
              <span className="text-xs md:text-sm text-gray-800 text-center">
                {icon.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      {selectedIcon && (
        <div className="mt-4 md:mt-6 p-4 md:p-6 rounded-lg bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
          <div
            className="rounded-2xl mx-auto md:mx-0 flex-shrink-0"
            style={{
              width: `${previewSize}px`,
              height: `${previewSize}px`,
              backgroundImage: `url('/image3.jpg')`,
              backgroundSize: `${iconSize * 4 * (previewSize / displaySize)}px ${iconSize * 4 * (previewSize / displaySize)}px`,
              backgroundPosition: `-${(selectedIcon.col * iconSize + selectedIcon.offsetX) * (previewSize / displaySize)}px -${(selectedIcon.row * iconSize + selectedIcon.offsetY) * (previewSize / displaySize)}px`
            }}
          />
          <div className="flex-1 w-full md:w-auto text-center md:text-left">
            <h3 className="m-0 text-lg md:text-xl font-semibold">{selectedIcon.name}</h3>
            <p className="mt-2 mb-0 text-gray-600 text-sm">Preview</p>
            <div className="mt-3 md:mt-4">
              <button 
                onClick={() => setSelectedIcon(null)}
                className="px-4 py-2 rounded-lg border-none bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}