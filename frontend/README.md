# Kosovo Weather Frontend

A modern, responsive weather application for Kosovo, built with React, TypeScript, and Tauri.

## Features

- Real-time weather updates for major cities in Kosovo
- 5-day weather forecast with interactive charts
- Multi-language support (English, Albanian, Turkish, Bosnian)
- Dark/Light mode
- Offline support
- Weather alerts
- Auto-refresh functionality
- Responsive design

## Prerequisites

- Node.js (v16 or later)
- pnpm (v8 or later)
- Rust (v1.70 or later)
- Tauri CLI

## Installation

1. Install dependencies:
```bash
pnpm install
```

2. Install Tauri dependencies:
```bash
pnpm tauri install
```

## Development

To start the development server:

```bash
pnpm tauri dev
```

This will start both the frontend development server and the Tauri application.

## Building

To create a production build:

```bash
pnpm tauri build
```

The built application will be available in the `src-tauri/target/release` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── src-tauri/         # Tauri backend
├── public/            # Static assets
└── index.html         # HTML entry point
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Create a production build
- `pnpm preview` - Preview the production build
- `pnpm tauri` - Run Tauri commands

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 