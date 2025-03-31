import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';

interface WeatherCardProps {
  city: {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
  onClick: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, onClick }) => {
  const { t } = useLanguage();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {city.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ThermostatIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography>
            {city.temperature}°C
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WaterDropIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography>
            {t('humidity')}: {city.humidity}%
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AirIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography>
            {t('windSpeed')}: {city.windSpeed} m/s
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {city.condition}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 