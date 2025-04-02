"use client"

import type React from "react"
import FileSaver from "file-saver"

interface ResultDisplayProps {
  resultImage: string | null
  isLoading: boolean
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage, isLoading }) => {
  const handleDownload = () => {
    if (resultImage) {
      fetch(resultImage)
        .then((res) => res.blob())
        .then((blob) => {
          FileSaver.saveAs(blob, "stippled-image.svg")
        })
        .catch((err) => {
          console.error("Error downloading image:", err)
        })
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-400">Result</h3>
        {resultImage && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-green-400 py-1.5 px-3 rounded-lg transition-colors text-sm"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download SVG
          </button>
        )}
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl h-[500px] flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <div className="text-center p-8">
            <div className="relative flex justify-center mb-8">
              <div className="w-20 h-20 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
              <div className="absolute w-24 h-24 border-2 border-green-400/20 border-solid rounded-full animate-ping"></div>
              <div
                className="absolute w-16 h-16 border-2 border-green-400/10 border-solid rounded-full animate-ping"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <p className="text-green-400 text-xl font-semibold mb-2">Processing image...</p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>Converting to stipple art with</span>
              <span className="font-mono text-green-400 animate-pulse">Rust WebAssembly</span>
            </div>
          </div>
        ) : resultImage ? (
          <div className="p-4 w-full h-full flex items-center justify-center">
            <img
              src={resultImage || "/placeholder.svg"}
              alt="Stippled result"
              className="max-w-full max-h-[460px] object-contain rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">The stippled image will appear here</p>
            <p className="text-gray-500 text-sm">Upload an image and adjust parameters to begin</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultDisplay

