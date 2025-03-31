# 🌦️ Kosovo Weather App

A modern, high-performance weather application exclusively for Kosovo cities, providing real-time weather updates, forecasts, and alerts.

## Features

- 🌡️ Real-time weather updates for major Kosovo cities
- 📊 Detailed forecasts and weather trends
- ⚡ High-performance, low-resource usage
- 🌙 Dark/Light mode support
- 📱 Responsive, modern UI with smooth animations
- 🔔 Custom weather alerts
- 💻 Cross-platform support (Windows, Linux, macOS)
- 🌐 Offline mode support
- 🇦🇱 Multi-language support (Albanian, Serbian)

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Python FastAPI
- Core Logic: Go
- Desktop Framework: Tauri
- Weather Data: OpenWeatherMap API

## Prerequisites

- Node.js (v16 or later)
- Python 3.8+
- Go 1.16+
- Rust (for Tauri)
- pnpm (recommended) or npm

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kosovo-weather.git
cd kosovo-weather
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Install Go dependencies
cd ../core
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your OpenWeatherMap API key
```

4. Start the development servers:
```bash
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend (in a new terminal)
cd frontend
pnpm tauri dev
```

## Building for Production

```bash
# Build frontend
cd frontend
pnpm tauri build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 