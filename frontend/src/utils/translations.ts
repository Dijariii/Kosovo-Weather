interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    dashboard: "Kosovo Weather Dashboard",
    loading: "Loading weather data...",
    feelsLike: "Feels like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    temperatureUnit: "Temperature Unit",
    weatherAlerts: "Weather Alerts",
    autoRefresh: "Auto Refresh",
    refreshInterval: "Refresh Interval (minutes)",
    resetDefaults: "Reset to Defaults",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    forecast: "5-Day Forecast",
    back: "Back",
  },
  sq: {
    dashboard: "Panorama e Motit në Kosovë",
    loading: "Duke ngarkuar të dhënat e motit...",
    feelsLike: "Ndjehet si",
    humidity: "Lagështia",
    windSpeed: "Shpejtësia e erës",
    settings: "Cilësimet",
    darkMode: "Mënyra e errët",
    language: "Gjuha",
    temperatureUnit: "Njësia e temperaturës",
    weatherAlerts: "Njoftimet e motit",
    autoRefresh: "Rifreskim i automatik",
    refreshInterval: "Intervali i rifreskimit (minuta)",
    resetDefaults: "Rivendos në parazgjedhje",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    forecast: "Parashikimi 5-ditor",
    back: "Kthehu",
  },
  tr: {
    dashboard: "Kosova Hava Durumu Panosu",
    loading: "Hava durumu verileri yükleniyor...",
    feelsLike: "Hissedilen",
    humidity: "Nem",
    windSpeed: "Rüzgar Hızı",
    settings: "Ayarlar",
    darkMode: "Karanlık Mod",
    language: "Dil",
    temperatureUnit: "Sıcaklık Birimi",
    weatherAlerts: "Hava Durumu Uyarıları",
    autoRefresh: "Otomatik Yenileme",
    refreshInterval: "Yenileme Aralığı (dakika)",
    resetDefaults: "Varsayılana Sıfırla",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    forecast: "5 Günlük Tahmin",
    back: "Geri",
  },
  bs: {
    dashboard: "Pregled vremena u Kosovu",
    loading: "Učitavanje podataka o vremenu...",
    feelsLike: "Osjeća se kao",
    humidity: "Vlažnost",
    windSpeed: "Brzina vjetra",
    settings: "Postavke",
    darkMode: "Tamni mod",
    language: "Jezik",
    temperatureUnit: "Jedinica temperature",
    weatherAlerts: "Upozorenja o vremenu",
    autoRefresh: "Automatsko osvježavanje",
    refreshInterval: "Interval osvježavanja (minute)",
    resetDefaults: "Vrati na zadano",
    celsius: "Celsius (°C)",
    fahrenheit: "Fahrenheit (°F)",
    forecast: "5-dnevna prognoza",
    back: "Nazad",
  },
};

export const getTranslation = (language: string, key: string): string => {
  return translations[language]?.[key] || translations['en'][key] || key;
}; 