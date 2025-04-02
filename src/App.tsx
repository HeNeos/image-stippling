"use client"

import { useState } from "react"
import TerminalHeader from "./components/TerminalHeader"
import ImageUploader from "./components/ImageUploader"
import ParametersForm, { type StipplingParams } from "./components/ParametersForm"
import ResultDisplay from "./components/ResultDisplay"
import useStippling from "./hooks/useStippling"

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [params, setParams] = useState<StipplingParams>({
    dots: 2000,
    minRadius: 2.0,
    maxRadius: 8.0,
    iterations: 100,
  })

  const { isWasmLoading, error, processImage, wasmLoaded } = useStippling()

  const handleImageUpload = (file: File) => {
    setSelectedImage(file)
    setResultImage(null)
  }

  const handleParamsChange = (newParams: StipplingParams) => {
    setParams(newParams)
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.")
      return
    }

    setIsProcessing(true)
    try {
      const result = await processImage(selectedImage, params)
      setResultImage(result)
    } catch (err) {
      console.error("Error during processing:", err)
      alert(err instanceof Error ? err.message : "An error occurred during processing.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 shadow-lg backdrop-blur-sm">
            <p className="text-red-400 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        {isWasmLoading ? (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl p-10 text-center">
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-green-300/20 border-solid rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-green-400 mb-2">Loading WebAssembly module...</p>
            <p className="text-gray-400">Preparing the stippling engine</p>
          </div>
        ) : (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
            <TerminalHeader title="Image Stippling" />

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ImageUploader onImageUpload={handleImageUpload} />
                  <ParametersForm
                    params={params}
                    onChange={handleParamsChange}
                    onSubmit={handleSubmit}
                    isProcessing={isProcessing}
                  />
                </div>
                <div>
                  <ResultDisplay resultImage={resultImage} isLoading={isProcessing} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 p-4 bg-gray-900/50">
              <p className="text-center text-gray-400 flex items-center justify-center gap-2">
                <span className="text-green-500 font-mono">Made with Rust</span>
                <span className="text-gray-600">|</span>
                <a
                  href="https://github.com/HeNeos/image-stippling"
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Source Code
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

