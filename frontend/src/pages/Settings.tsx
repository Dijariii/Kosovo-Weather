import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { invoke } from '@tauri-apps/api/tauri';

interface Settings {
  isDarkMode: boolean;
  language: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({
    isDarkMode: false,
    language: 'en',
    temperatureUnit: 'celsius',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await invoke<Settings>('get_settings');
        setSettings(savedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = async (key: keyof Settings, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await invoke('save_settings', { settings: newSettings });
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Typography variant="h4" className="mb-6">
        Settings
      </Typography>

      <Paper className="p-4">
        <Box className="space-y-4">
          <FormControlLabel
            control={
              <Switch
                checked={settings.isDarkMode}
                onChange={(e) => handleSettingChange('isDarkMode', e.target.checked)}
              />
            }
            label="Dark Mode"
          />

          <Divider />

          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              label="Language"
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="sq">Albanian</MenuItem>
              <MenuItem value="tr">Turkish</MenuItem>
              <MenuItem value="bs">Bosnian</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Temperature Unit</InputLabel>
            <Select
              value={settings.temperatureUnit}
              label="Temperature Unit"
              onChange={(e) => handleSettingChange('temperatureUnit', e.target.value)}
            >
              <MenuItem value="celsius">Celsius (°C)</MenuItem>
              <MenuItem value="fahrenheit">Fahrenheit (°F)</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
            }
            label="Weather Alerts"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.autoRefresh}
                onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
              />
            }
            label="Auto Refresh"
          />

          {settings.autoRefresh && (
            <FormControl fullWidth>
              <InputLabel>Refresh Interval (minutes)</InputLabel>
              <Select
                value={settings.refreshInterval}
                label="Refresh Interval (minutes)"
                onChange={(e) => handleSettingChange('refreshInterval', e.target.value)}
              >
                <MenuItem value={1}>1 minute</MenuItem>
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        <Box className="mt-6 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => invoke('reset_settings')}
          >
            Reset to Defaults
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default Settings; 