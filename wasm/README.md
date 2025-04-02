# Rust WebAssembly Integration

This directory is where your Rust/WASM code should be placed.

## Instructions

1. Create a new Rust library crate in this directory using:
   ```
   cargo new --lib .
   ```

2. Configure your Rust code with wasm-bindgen to expose functions to JavaScript.

3. Build your WebAssembly module with:
   ```
   wasm-pack build --target web
   ```

4. When the build is complete, there will be a `pkg` directory containing the compiled WebAssembly module.

# WebAssembly Stippling Module

This directory contains the Rust code for the stippling algorithm that gets compiled to WebAssembly.

## Building the WebAssembly Module

1. Make sure you have Rust and wasm-pack installed:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

2. Build the WebAssembly module:
   ```bash
   wasm-pack build --target web
   ```

3. This will create a `pkg` directory with the compiled WebAssembly module.

## Integration with the Web Application

The web application will automatically use the compiled WebAssembly module if it's available. Make sure to run the build command before starting the web application.

## Code Structure

- `src/lib.rs`: Main entry point for the WebAssembly module
- `src/point.rs`: Point data structures and utilities
- `src/stippling.rs`: Implementation of the stippling algorithm
- `src/image_processing.rs`: Image loading and processing utilities

## Parameters

The `stipple_image` function accepts the following parameters:
- `image_data`: Raw image data
- `num_dots`: Number of stippling points (between 100 and 4096)
- `dot_size`: Size of the dots (between 0.5 and 5.0)
- `iterations`: Number of iterations for the algorithm (between 20 and 200)

The algorithm is based on weighted Voronoi stippling as described in the paper "Weighted Voronoi Stippling" by Adrian Secord.

## Example Rust Code Structure

Your Rust code should export functions that can be called from JavaScript:

