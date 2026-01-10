// API Route to generate a weather card
import { getWeatherData, generateWeatherScript } from "@/services/weatherService";

export async function POST(request) {
  try {
    const { location } = await request.json();

    if (!location) {
      return Response.json({ error: "Location is required" }, { status: 400 });
    }

    // Step 1: Fetch weather data from API
    const weatherData = await getWeatherData(location);

    // Step 2: Generate script for text-to-speech
    const script = generateWeatherScript(weatherData);

    // Step 3: Return data (in production, you'd also generate TTS and create card)
    return Response.json({
      success: true,
      weather: weatherData,
      script,
      message: "Weather data retrieved successfully!",
    });

  } catch (error) {
    console.error("Weather card generation error:", error);
    return Response.json(
      {
        error: error.message || "Failed to generate weather card",
      },
      { status: 500 }
    );
  }
}
