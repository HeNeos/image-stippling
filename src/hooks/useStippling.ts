import { useState, useEffect, useCallback } from 'react';
import { StipplingParams } from '../components/ParametersForm.tsx';

interface StipplingWasm {
  stipple_image: (imageData: Uint8Array, numDots: number, minRadius: number, maxRadius: number, iterations: number) => [number, number];
  js_data_to_vec: (data: Uint8ClampedArray) => Uint8Array;
  vec_to_js_data: (data: Uint8Array) => Uint8Array;
  memory: WebAssembly.Memory;
}

interface WasmPackModule {
  default: () => Promise<StipplingWasm>;
  stipple_image?: StipplingWasm['stipple_image'];
}

const mockStippling = async (
  imageData: Uint8Array,
  params: StipplingParams
): Promise<string> => {
  console.log('Using mock stippling with params:', params);
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return "";
};

const useStippling = () => {
  const [wasmModule, setWasmModule] = useState<StipplingWasm | null>(null);
  const [isWasmLoading, setIsWasmLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        setIsWasmLoading(true);

        try {
          const wasmModule = await import('../../wasm/pkg/stippling_wasm.js') as unknown as WasmPackModule;
          const instance = await wasmModule.default();

          setWasmModule(instance);
          setError(null);
        } catch (_importError) {
          setWasmModule(null);
          setError('WebAssembly module not available. Using mock implementation. Build the WASM module for full functionality.');
        }
      } catch (err) {
        console.error('Failed to load WebAssembly module:', err);
        setError('Failed to load WebAssembly module. Please check the console for details.');
        setWasmModule(null);
      } finally {
        setIsWasmLoading(false);
      }
    };

    loadWasm();
  }, []);

  // Function to process an image using the WebAssembly module
  const processImage = useCallback(async (
    imageFile: File,
    params: StipplingParams
  ): Promise<string> => {
    try {
      // Read the image file as an ArrayBuffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const imageData = new Uint8Array(arrayBuffer);

      console.log('Processing image with params:', params);
      console.log('Image size:', imageData.length, 'bytes');

      let svgString: string;

      if (wasmModule) {
        try {
          const [ptr, len] = wasmModule.stipple_image(
            imageData,
            params.dots,
            params.minRadius,
            params.maxRadius,
            params.iterations
          );
          const memoryBuffer = new Uint8Array(wasmModule.memory.buffer, ptr, len);
          svgString = new TextDecoder('utf-8').decode(memoryBuffer);
        } catch (wasmError) {
          console.error('Error in WebAssembly processing:', wasmError);
          throw new Error('WebAssembly processing failed. Try with a smaller image or fewer dots.');
        }
      } else {
        svgString = await mockStippling(imageData, params);
      }
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    } catch (err) {
      console.error('Error processing image:', err);
      throw new Error('Failed to process the image. Please try again.');
    }
  }, [wasmModule]);

  return {
    isWasmLoading,
    error,
    processImage,
    wasmLoaded: !isWasmLoading && wasmModule !== null
  };
};

export default useStippling;

