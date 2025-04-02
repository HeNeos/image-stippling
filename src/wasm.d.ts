declare module "../../wasm/pkg" {
  export function stipple_image(
    imageData: Uint8Array,
    numDots: number,
    dotSize: number,
    iterations: number
  ): Uint8Array;

  export function js_data_to_vec(data: Uint8ClampedArray): Uint8Array;

  export function vec_to_js_data(data: Uint8Array): Uint8Array;
}

