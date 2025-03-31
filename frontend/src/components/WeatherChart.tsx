import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastData {
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherChartProps {
  forecast?: ForecastData[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ forecast = [] }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Wind Speed (m/s)',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    if (forecast.length > 0) {
      setChartData({
        labels: forecast.map((data) => data.date),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: forecast.map((data) => data.temperature),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Humidity (%)',
            data: forecast.map((data) => data.humidity),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
          {
            label: 'Wind Speed (m/s)',
            data: forecast.map((data) => data.windSpeed),
            borderColor: 'rgb(53, 162, 235)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [forecast]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weather Forecast',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ height: 400 }}>
      <Line options={options} data={chartData} />
    </Box>
  );
};

export default WeatherChart; 