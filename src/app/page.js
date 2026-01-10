"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate card");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>🎵 Yoto Weather Card</h1>
        <p className={styles.description}>
          Generate custom Yoto cards with real-time weather information
        </p>

        <div className={styles.authSection}>
          <a href="/api/auth/login" className={styles.loginButton}>
            🔐 Connect with Yoto
          </a>
        </div>

        <form onSubmit={handleGenerateCard} className={styles.form}>
          <input
            type="text"
            placeholder="Enter location (e.g., London, Paris, Tokyo)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? "Generating..." : "Generate Weather Card"}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className={styles.success}>
            <h2>✅ {result.message}</h2>
            
            <div className={styles.weatherInfo}>
              <h3>📍 {result.weather.location}</h3>
              <p>🌡️ Temperature: {result.weather.temperature}°C</p>
              <p>☁️ Conditions: {result.weather.description}</p>
              <p>💧 Humidity: {result.weather.humidity}%</p>
              <p>💨 Wind Speed: {result.weather.windSpeed} m/s</p>
            </div>

            <details className={styles.scriptPreview}>
              <summary>📝 View Generated Script</summary>
              <pre>{result.script}</pre>
            </details>
          </div>
        )}

        <footer className={styles.footer}>
          <p>
            Built with ❤️ for the Yoto community | 
            <a href="https://yoto.dev" target="_blank" rel="noopener noreferrer"> Yoto Developer Docs</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
