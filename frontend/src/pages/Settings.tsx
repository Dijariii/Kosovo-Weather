import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
    Button,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { getSettings, saveSettings, resetSettings, Settings as SettingsType, ApiError } from '../lib/api';

export default function Settings() {
    const [settings, setSettings] = useState<SettingsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            setError(null);
            const data = await getSettings();
            setSettings(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!settings) return;

        try {
            setSaving(true);
            setError(null);
            await saveSettings(settings);
            setSuccess('Settings saved successfully');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    }

    async function handleReset() {
        try {
            setSaving(true);
            setError(null);
            const defaultSettings = await resetSettings();
            setSettings(defaultSettings);
            setSuccess('Settings reset to defaults');
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Failed to reset settings');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (!settings) {
        return (
            <Box m={2}>
                <Alert severity="error">
                    Failed to load settings
                    <Button color="inherit" size="small" onClick={loadSettings}>
                        Retry
                    </Button>
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <FormControl fullWidth margin="normal">
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.dark_mode}
                            onChange={(e) => setSettings({ ...settings, dark_mode: e.target.checked })}
                        />
                    }
                    label="Dark Mode"
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Language</InputLabel>
                <Select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    label="Language"
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="sq">Albanian</MenuItem>
                    <MenuItem value="tr">Turkish</MenuItem>
                    <MenuItem value="bs">Bosnian</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Temperature Unit</InputLabel>
                <Select
                    value={settings.temperature_unit}
                    onChange={(e) => setSettings({ ...settings, temperature_unit: e.target.value })}
                    label="Temperature Unit"
                >
                    <MenuItem value="celsius">Celsius</MenuItem>
                    <MenuItem value="fahrenheit">Fahrenheit</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.notifications_enabled}
                            onChange={(e) =>
                                setSettings({ ...settings, notifications_enabled: e.target.checked })
                            }
                        />
                    }
                    label="Enable Notifications"
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.auto_refresh}
                            onChange={(e) => setSettings({ ...settings, auto_refresh: e.target.checked })}
                        />
                    }
                    label="Auto Refresh"
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <TextField
                    label="Refresh Interval (seconds)"
                    type="number"
                    value={settings.refresh_interval}
                    onChange={(e) =>
                        setSettings({
                            ...settings,
                            refresh_interval: Math.max(60, parseInt(e.target.value) || 60),
                        })
                    }
                    disabled={!settings.auto_refresh}
                    inputProps={{ min: 60 }}
                />
            </FormControl>

            <FormControl fullWidth margin="normal">
                <TextField
                    label="OpenWeatherMap API Key"
                    type="password"
                    value={settings.api_key || ''}
                    onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                />
            </FormControl>

            <Box mt={3} display="flex" gap={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <CircularProgress size={24} /> : 'Save Settings'}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleReset}
                    disabled={saving}
                >
                    Reset to Defaults
                </Button>
            </Box>

            <Snackbar
                open={!!success}
                autoHideDuration={3000}
                onClose={() => setSuccess(null)}
                message={success}
            />
        </Box>
    );
} 