# Yoto Weather Card Generator

A Next.js framework for creating Yoto cards that integrate third-party APIs with text-to-speech capabilities. This example uses a weather API.

## Prerequisites

1. Create a Yoto app at [Yoto Developer Portal](https://yoto.dev/get-started/start-here/)
2. Get your Client ID and Client Secret
3. Get a weather API key (e.g., from [OpenWeatherMap](https://openweathermap.org/api))
4. Node.js 18+ installed

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your `YOTO_CLIENT_ID` and `YOTO_CLIENT_SECRET`
   - Add your `WEATHER_API_KEY`

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

- ✅ OAuth authentication with Yoto
- ✅ Weather API integration example
- ✅ Text-to-speech generation
- ✅ Easy to adapt to other APIs
- ✅ Simple configuration

## Adding Your Own API

1. Add your API key to `.env`
2. Create a service in `src/services/` (see `weatherService.js` as example)
3. Create an API route in `src/app/api/`
4. Update the frontend to display content

## Sharing with Yoto Community

Once your card is ready, follow the [Yoto Publishing Guidelines](https://yoto.dev/publishing/) to share it with the community.