mod image_processing;
mod point;
mod stippling;

use image::{ImageBuffer, Rgba, RgbaImage};
use js_sys::{Uint8Array, Uint8ClampedArray};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format!($($t)*)));
}

#[wasm_bindgen]
pub fn stipple_image(
    image_data: &js_sys::Uint8Array,
    num_dots: u32,
    min_radius: f32,
    max_radius: f32,
    iterations: u32,
) -> Result<String, JsValue> {
    let image_vec = image_data.to_vec();

    let (img, gray_img) = match image_processing::load_from_memory(&image_vec) {
        Ok((img, gray_img)) => (img, gray_img),
        Err(e) => {
            console_log!("Failed to load image: {}", e);
            return Err(JsValue::from_str(&e));
        }
    };

    let (width, height) = gray_img.dimensions();
    console_log!("Image dimensions: {}x{}", width, height);

    let num_dots = num_dots as usize;
    let iterations = iterations as usize;

    let (points, radii, colors) =
        stippling::generate_stippling(&gray_img, &img, num_dots, 42, iterations);

    // Start creating the SVG string.
    let mut svg = format!(
        "<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}'>\n",
        w = width,
        h = height
    );

    // Create a white background.
    svg.push_str(&format!(
        "<rect width='100%' height='100%' fill='white' />\n"
    ));

    // Get the maximum radius for normalization.
    let max_radii = radii.iter().cloned().fold(0.0, f32::max);

    // Iterate through each stippling point.
    for (i, &(x, y)) in points.iter().enumerate() {
        if i < radii.len() && i < colors.len() {
            let base_radius = radii[i];
            let point_color = &colors[i];

            // Normalize and scale radius.
            let normalized_radius = if max_radii > 0.0 {
                base_radius / max_radii
            } else {
                0.0
            };

            let scaled_radius = min_radius + (max_radius - min_radius) * normalized_radius;

            // Create an SVG circle element.
            let circle = format!(
                "<circle cx='{cx}' cy='{cy}' r='{r}' fill='rgba({red},{green},{blue},1)' />\n",
                cx = x,
                cy = y,
                r = scaled_radius,
                red = point_color.r,
                green = point_color.g,
                blue = point_color.b
            );
            svg.push_str(&circle);
        }
    }
    svg.push_str("</svg>");
    Ok(svg)
}

// Draw a filled circle using the Bresenham circle algorithm.
fn draw_dot(image: &mut RgbaImage, cx: u32, cy: u32, radius: u32, color: Rgba<u8>) {
    let (width, height) = image.dimensions();
    let cx = cx as i32;
    let cy = cy as i32;
    let radius = radius as i32;

    let mut x = radius;
    let mut y = 0;
    let mut d = 3 - 2 * radius;

    while y <= x {
        draw_horizontal_line(image, cx - x, cx + x, cy + y, color, width, height);
        draw_horizontal_line(image, cx - x, cx + x, cy - y, color, width, height);
        draw_horizontal_line(image, cx - y, cx + y, cy + x, color, width, height);
        draw_horizontal_line(image, cx - y, cx + y, cy - x, color, width, height);

        if d < 0 {
            d += 4 * y + 6;
        } else {
            d += 4 * (y - x) + 10;
            x -= 1;
        }
        y += 1;
    }
}

fn draw_horizontal_line(
    image: &mut RgbaImage,
    mut x_start: i32,
    mut x_end: i32,
    y: i32,
    color: Rgba<u8>,
    width: u32,
    height: u32,
) {
    if y < 0 || y >= height as i32 {
        return;
    }
    if x_start > x_end {
        std::mem::swap(&mut x_start, &mut x_end);
    }
    x_start = x_start.max(0);
    x_end = x_end.min(width as i32 - 1);

    for x in x_start..=x_end {
        image.put_pixel(x as u32, y as u32, color);
    }
}

#[wasm_bindgen]
pub fn js_data_to_vec(data: Uint8ClampedArray) -> Vec<u8> {
    data.to_vec()
}

#[wasm_bindgen]
pub fn vec_to_js_data(data: Vec<u8>) -> Uint8Array {
    Uint8Array::from(&data[..])
}
