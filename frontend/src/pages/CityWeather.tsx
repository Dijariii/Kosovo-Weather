import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Grid,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import WeatherChart from '../components/WeatherChart';

interface WeatherData {
  city: {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
  forecast: Array<{
    date: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
  }>;
}

const CityWeather: React.FC = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/weather/${cityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (cityId) {
      fetchWeatherData();
    }
  }, [cityId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !weatherData) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography color="error">{error || 'Weather data not found'}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            {t('back')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mb: 2 }}
          >
            {t('back')}
          </Button>
          <Typography variant="h4" gutterBottom>
            {weatherData.city.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                {weatherData.city.temperature}°C
              </Typography>
              <Typography color="text.secondary">
                {weatherData.city.condition}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                {t('humidity')}: {weatherData.city.humidity}%
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6">
                {t('windSpeed')}: {weatherData.city.windSpeed} m/s
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h6" gutterBottom>
          {t('forecast')}
        </Typography>
        <WeatherChart forecast={weatherData.forecast} />
      </Paper>
    </Container>
  );
};

export default CityWeather; 