from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Kosovo Weather API",
    description="Weather API for Kosovo cities",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class WeatherData(BaseModel):
    city: str
    temperature: float
    humidity: int
    wind_speed: float
    description: str
    icon: str

class City(BaseModel):
    name: str
    country: str
    lat: float
    lon: float

# Kosovo cities data
KOSOVO_CITIES = {
    "Pristina": {"lat": 42.6629, "lon": 21.1655},
    "Prizren": {"lat": 42.2139, "lon": 20.7397},
    "Peja": {"lat": 42.6609, "lon": 20.2883},
    "Gjakova": {"lat": 42.3803, "lon": 20.4309},
    "Mitrovica": {"lat": 42.8914, "lon": 20.8660},
    "Ferizaj": {"lat": 42.3705, "lon": 21.1553},
}

@app.get("/")
async def root():
    return {"message": "Welcome to Kosovo Weather API"}

@app.get("/cities")
async def get_cities():
    return {"cities": list(KOSOVO_CITIES.keys())}

@app.get("/weather/{city}")
async def get_weather(city: str):
    if city not in KOSOVO_CITIES:
        raise HTTPException(status_code=404, detail="City not found")
    
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    city_data = KOSOVO_CITIES[city]
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={city_data['lat']}&lon={city_data['lon']}&appid={api_key}&units=metric"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Weather data not available")
        
        data = response.json()
        return WeatherData(
            city=city,
            temperature=data["main"]["temp"],
            humidity=data["main"]["humidity"],
            wind_speed=data["wind"]["speed"],
            description=data["weather"][0]["description"],
            icon=data["weather"][0]["icon"]
        )

@app.get("/forecast/{city}")
async def get_forecast(city: str):
    if city not in KOSOVO_CITIES:
        raise HTTPException(status_code=404, detail="City not found")
    
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    city_data = KOSOVO_CITIES[city]
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={city_data['lat']}&lon={city_data['lon']}&appid={api_key}&units=metric"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Forecast data not available")
        
        return response.json()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 