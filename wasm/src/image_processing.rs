use image::{DynamicImage, GrayImage, RgbaImage};
use std::io::Cursor;

pub fn load_from_memory(image_data: &[u8]) -> Result<(DynamicImage, GrayImage), String> {
    let img =
        image::load_from_memory(image_data).map_err(|e| format!("Failed to parse image: {}", e))?;

    let gray_img = img.to_luma8();

    Ok((img, gray_img))
}

pub fn rgba_to_png(img: &RgbaImage) -> Result<Vec<u8>, String> {
    let mut buffer = Vec::new();
    let mut cursor = Cursor::new(&mut buffer);
    img.write_to(&mut cursor, image::ImageOutputFormat::Png)
        .map_err(|e| format!("Failed to encode image: {}", e))?;

    Ok(buffer)
}
