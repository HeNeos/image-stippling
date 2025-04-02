"use client"

import type React from "react"
import { useRef, useState } from "react"

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        processFile(file)
      } else {
        alert("Please upload an image file.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        processFile(file)
      } else {
        alert("Please upload an image file.")
      }
    }
  }

  const processFile = (file: File) => {
    setPreview(URL.createObjectURL(file))
    onImageUpload(file)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-400">Upload Image</h3>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging ? "border-green-500 bg-green-500/10" : "border-gray-600 hover:border-green-500/50 bg-gray-800/50"
        } p-6 cursor-pointer min-h-[300px] flex items-center justify-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="text-center w-full">
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="max-h-[280px] mx-auto rounded-lg object-contain shadow-lg"
              />
              <p className="text-gray-300">Click or drag to replace image</p>
            </div>
          ) : (
            <div className="py-8 space-y-4">
              <div className="bg-gray-700/50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 font-medium">Click or drag image here</p>
                <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG</p>
              </div>
            </div>
          )}
        </div>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      </div>
    </div>
  )
}

export default ImageUploader

