#!/bin/bash

# Install npm dependencies
pnpm install

# Install additional type definitions
pnpm add -D @types/react @types/react-dom @types/node
pnpm add chart.js @types/chart.js

# Install Tauri dependencies
pnpm tauri install

echo "Dependencies installed successfully!" 