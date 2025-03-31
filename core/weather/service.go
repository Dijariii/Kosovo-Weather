package weather

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/patrickmn/go-cache"
)

type WeatherData struct {
	City        string  `json:"city"`
	Temperature float64 `json:"temperature"`
	Humidity    int     `json:"humidity"`
	WindSpeed   float64 `json:"wind_speed"`
	Description string  `json:"description"`
	Icon        string  `json:"icon"`
	Timestamp   int64   `json:"timestamp"`
}

type WeatherService struct {
	redisClient *redis.Client
	memCache   *cache.Cache
}

func NewWeatherService(redisAddr string) *WeatherService {
	rdb := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	return &WeatherService{
		redisClient: rdb,
		memCache:   cache.New(5*time.Minute, 10*time.Minute),
	}
}

func (s *WeatherService) GetWeather(ctx context.Context, city string) (*WeatherData, error) {
	// Try memory cache first
	if data, found := s.memCache.Get(city); found {
		return data.(*WeatherData), nil
	}

	// Try Redis cache
	key := fmt.Sprintf("weather:%s", city)
	val, err := s.redisClient.Get(ctx, key).Result()
	if err == nil {
		var weatherData WeatherData
		if err := json.Unmarshal([]byte(val), &weatherData); err == nil {
			s.memCache.Set(city, &weatherData, cache.DefaultExpiration)
			return &weatherData, nil
		}
	}

	return nil, fmt.Errorf("weather data not found for city: %s", city)
}

func (s *WeatherService) UpdateWeather(ctx context.Context, data *WeatherData) error {
	// Update memory cache
	s.memCache.Set(data.City, data, cache.DefaultExpiration)

	// Update Redis cache
	key := fmt.Sprintf("weather:%s", data.City)
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return s.redisClient.Set(ctx, key, jsonData, 30*time.Minute).Err()
}

func (s *WeatherService) GetForecast(ctx context.Context, city string) ([]WeatherData, error) {
	key := fmt.Sprintf("forecast:%s", city)
	val, err := s.redisClient.Get(ctx, key).Result()
	if err != nil {
		return nil, fmt.Errorf("forecast not found for city: %s", city)
	}

	var forecast []WeatherData
	if err := json.Unmarshal([]byte(val), &forecast); err != nil {
		return nil, err
	}

	return forecast, nil
}

func (s *WeatherService) UpdateForecast(ctx context.Context, city string, forecast []WeatherData) error {
	key := fmt.Sprintf("forecast:%s", city)
	jsonData, err := json.Marshal(forecast)
	if err != nil {
		return err
	}

	return s.redisClient.Set(ctx, key, jsonData, 3*time.Hour).Err()
}

func (s *WeatherService) Close() error {
	return s.redisClient.Close()
} 