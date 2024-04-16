// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;
use std::fs::{self, File};
use std::io::prelude::*;
use utm::{lat_lon_to_zone_number, lat_to_zone_letter, to_utm_wgs84};

#[tauri::command]
fn convert_latlng_to_utm(lat: f64, lon: f64) -> String {
    let zone = lat_lon_to_zone_number(lat, lon);
    let (northing, easting, _) = to_utm_wgs84(lat, lon, zone);
    let zone_letter = match lat_to_zone_letter(lat) {
        Some(c) => c,
        None => ' ',
    };

    let result = json!({
        "zone": zone,
        "zone_letter": zone_letter,
        "easting": easting,
        "northing": northing
    });

    serde_json::to_string(&result).unwrap()
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    if fs::metadata(&path).is_ok() {
        // If the file exists, attempt to delete it
        if let Err(err) = fs::remove_file(&path) {
            return Err(format!("Failed to delete existing file: {}", err));
        }
    }

    let mut file = match File::create(path) {
        Ok(file) => file,
        Err(err) => return Err(format!("Failed to create file: {}", err)),
    };

    match file.write_all(content.as_bytes()) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Failed to write to file: {}", err)),
    }
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    let mut file = match File::open(path) {
        Ok(file) => file,
        Err(err) => return Err(format!("Failed to open file: {}", err)),
    };

    let mut content = String::new();
    match file.read_to_string(&mut content) {
        Ok(_) => Ok(content),
        Err(err) => Err(format!("Failed to read file: {}", err)),
    }
}

#[tauri::command]
async fn request_df(url: String) -> Result<String, String> {
    let client = reqwest::Client::new();

    match client.get(&url).send().await {
        Ok(response) => {
            let body = response.text().await.unwrap_or_else(|_| String::new());
            Ok(body)
        }
        Err(_) => Err("Failed to make request DF".to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            convert_latlng_to_utm,
            write_file,
            read_file,
            request_df
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
