# Client Registration Application

A comprehensive React application for client registration with support for multiple business entities.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Multi-step form with validation
- Support for multiple business entities:
  - Sole Trader (max 1)
  - Companies (unlimited)
  - Trusts (unlimited)
  - SMSFs (unlimited)
  - Partnerships (unlimited)
  - Investment Properties (unlimited)
- Field validation (email, TFN, ABN, ACN)
- Dynamic list management (trading names, industry codes)

## Project Structure

```
src/
  ├── components/
  │   ├── steps/          # Form step components
  │   └── entities/       # Business entity components
  ├── hooks/              # Custom React hooks
  ├── utils/              # Utility functions
  ├── App.js              # Main app component
  └── index.js            # Entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
