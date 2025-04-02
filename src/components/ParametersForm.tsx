"use client"

import type React from "react"

export interface StipplingParams {
  dots: number
  minRadius: number
  maxRadius: number
  iterations: number
}

interface ParametersFormProps {
  params: StipplingParams
  onChange: (params: StipplingParams) => void
  onSubmit: () => void
  isProcessing: boolean
}

const ParametersForm: React.FC<ParametersFormProps> = ({ params, onChange, onSubmit, isProcessing }) => {
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)

    if (name === "minRadius" && numValue > params.maxRadius) {
      onChange({
        ...params,
        minRadius: numValue,
        maxRadius: numValue,
      })
    } else if (name === "maxRadius" && numValue < params.minRadius) {
      onChange({
        ...params,
        maxRadius: params.minRadius,
      })
    }

    onChange({
      ...params,
      [name]: numValue,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Stippling Parameters</h3>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="dots" className="text-gray-300 font-medium">
              Number of points
            </label>
            <span className="text-green-400 font-mono bg-gray-800 px-2 py-1 rounded text-sm">{params.dots}</span>
          </div>
          <input
            type="range"
            id="dots"
            name="dots"
            min="1000"
            max="7000"
            step="100"
            value={params.dots}
            onChange={handleParamChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1000</span>
            <span>7000</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="minRadius" className="text-gray-300 font-medium">
              Minimum Radius
            </label>
            <span className="text-green-400 font-mono bg-gray-800 px-2 py-1 rounded text-sm">
              {params.minRadius.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            id="minRadius"
            name="minRadius"
            min="1.0"
            max="10.0"
            step="0.1"
            value={params.minRadius}
            onChange={handleParamChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.0</span>
            <span>10.0</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="maxRadius" className="text-gray-300 font-medium">
              Maximum Radius
            </label>
            <span className="text-green-400 font-mono bg-gray-800 px-2 py-1 rounded text-sm">
              {params.maxRadius.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            id="maxRadius"
            name="maxRadius"
            min="1.0"
            max="10.0"
            step="0.1"
            value={params.maxRadius}
            onChange={handleParamChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1.0</span>
            <span>10.0</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="iterations" className="text-gray-300 font-medium">
              Iterations
            </label>
            <span className="text-green-400 font-mono bg-gray-800 px-2 py-1 rounded text-sm">{params.iterations}</span>
          </div>
          <input
            type="range"
            id="iterations"
            name="iterations"
            min="50"
            max="250"
            step="10"
            value={params.iterations}
            onChange={handleParamChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>50</span>
            <span>250</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
          isProcessing
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/20"
        }`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Generate Stippling
          </span>
        )}
      </button>
    </form>
  )
}

export default ParametersForm

