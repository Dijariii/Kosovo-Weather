// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::api::path;
use std::sync::Mutex;
use std::time::{Duration, SystemTime};
use std::collections::HashMap;

// Custom error type for better error handling
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
    #[error("Settings error: {0}")]
    Settings(String),
    #[error("System error: {0}")]
    System(String),
}

// Result type alias for our custom error
type Result<T, E = AppError> = std::result::Result<T, E>;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Settings {
    dark_mode: bool,
    language: String,
    temperature_unit: String,
    notifications_enabled: bool,
    auto_refresh: bool,
    refresh_interval: u64,
    last_update: Option<u64>,
    api_key: Option<String>,
}

// Cache structure for performance optimization
struct Cache {
    data: HashMap<String, (SystemTime, serde_json::Value)>,
    ttl: Duration,
}

impl Cache {
    fn new(ttl_seconds: u64) -> Self {
        Self {
            data: HashMap::new(),
            ttl: Duration::from_secs(ttl_seconds),
        }
    }

    fn get(&self, key: &str) -> Option<&serde_json::Value> {
        if let Some((timestamp, value)) = self.data.get(key) {
            if timestamp.elapsed().unwrap_or_default() < self.ttl {
                return Some(value);
            }
        }
        None
    }

    fn set(&mut self, key: String, value: serde_json::Value) {
        self.data.insert(key, (SystemTime::now(), value));
    }
}

// Global state management
struct AppState {
    cache: Mutex<Cache>,
    settings: Mutex<Option<Settings>>,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            dark_mode: false,
            language: "en".to_string(),
            temperature_unit: "celsius".to_string(),
            notifications_enabled: true,
            auto_refresh: true,
            refresh_interval: 300,
            last_update: None,
            api_key: None,
        }
    }
}

impl Settings {
    fn validate(&self) -> Result<()> {
        if self.refresh_interval < 60 {
            return Err(AppError::Settings("Refresh interval must be at least 60 seconds".into()));
        }
        if !["en", "sq", "tr", "bs"].contains(&self.language.as_str()) {
            return Err(AppError::Settings("Invalid language selection".into()));
        }
        if !["celsius", "fahrenheit"].contains(&self.temperature_unit.as_str()) {
            return Err(AppError::Settings("Invalid temperature unit".into()));
        }
        Ok(())
    }
}

fn get_settings_path() -> Result<PathBuf> {
    let mut path = path::app_config_dir(&tauri::Config::default())
        .ok_or_else(|| AppError::System("Failed to get config directory".into()))?;
    path.push("settings.json");
    Ok(path)
}

#[tauri::command]
async fn get_settings(state: tauri::State<'_, AppState>) -> Result<Settings, String> {
    let settings_guard = state.settings.lock().map_err(|e| e.to_string())?;
    if let Some(settings) = &*settings_guard {
        Ok(settings.clone())
    } else {
        let settings = load_settings().map_err(|e| e.to_string())?;
        Ok(settings)
    }
}

fn load_settings() -> Result<Settings> {
    let path = get_settings_path()?;
    if path.exists() {
        let content = fs::read_to_string(&path)?;
        let settings: Settings = serde_json::from_str(&content)?;
        settings.validate()?;
        Ok(settings)
    } else {
        Ok(Settings::default())
    }
}

#[tauri::command]
async fn save_settings(settings: Settings, state: tauri::State<'_, AppState>) -> Result<(), String> {
    settings.validate().map_err(|e| e.to_string())?;
    let path = get_settings_path().map_err(|e| e.to_string())?;
    
    // Ensure the config directory exists
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    // Update state
    let mut settings_guard = state.settings.lock().map_err(|e| e.to_string())?;
    *settings_guard = Some(settings);

    Ok(())
}

#[tauri::command]
async fn reset_settings(state: tauri::State<'_, AppState>) -> Result<Settings, String> {
    let path = get_settings_path().map_err(|e| e.to_string())?;
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }

    let settings = Settings::default();
    let mut settings_guard = state.settings.lock().map_err(|e| e.to_string())?;
    *settings_guard = Some(settings.clone());

    Ok(settings)
}

#[tauri::command]
async fn clear_cache(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut cache = state.cache.lock().map_err(|e| e.to_string())?;
    cache.data.clear();
    Ok(())
}

fn main() {
    let app_state = AppState {
        cache: Mutex::new(Cache::new(300)), // 5 minutes TTL
        settings: Mutex::new(None),
    };

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            get_settings,
            save_settings,
            reset_settings,
            clear_cache,
        ])
        .setup(|app| {
            // Initialize settings on startup
            let state: tauri::State<AppState> = app.state();
            let settings = load_settings()?;
            let mut settings_guard = state.settings.lock().map_err(|e| AppError::System(e.to_string()))?;
            *settings_guard = Some(settings);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
