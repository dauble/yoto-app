// Weather API Service
// This example uses OpenWeatherMap API
// Replace with your preferred weather API

export async function getWeatherData(location) {
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error("Weather API key not configured");
  }

  // Example using OpenWeatherMap API
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  
  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
  };
}

export function generateWeatherScript(weatherData) {
  // Generate a script for text-to-speech
  return `Hello! Here's the weather for ${weatherData.location}. 
    
    The current temperature is ${weatherData.temperature} degrees celsius.
    Conditions are ${weatherData.description}.
    The humidity is ${weatherData.humidity} percent.
    Wind speed is ${weatherData.windSpeed} meters per second.
    
    Have a great day!`;
}
