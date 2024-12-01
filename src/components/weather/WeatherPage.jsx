"use client";
import { useState, useCallback, lazy, Suspense } from "react";
import "../../css/weather.css";
import { fetchData } from "../../common/apiHelper";
const WeatherListing = lazy(() => import("../Listing/WeatherListing"));

export default function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [errorProviders, setErrorProviders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchWeather = useCallback(async () => {
    try {
      const lat = 19.076;
      const lon = 72.8777;
      setErrorMessage("");
      const { data } = await fetchData(`${apiUrl}/api/weather`, {
        lat,
        lon,
      });
      if (data?.status === "success") {
        const weather = data?.data?.weatherData.filter((w) => !w.error);
        const errors = data?.data?.weatherData.filter((w) => w.error);

        setErrorProviders(
          errors.map((e) => ({
            provider: e.provider,
            errorMessage: e.errorMessage || "Unknown error",
          }))
        );

        const mergedData = weather.map((w) => ({
          ...w,
          pinned: data?.data?.pinnedProviders.some(
            (p) => p.provider === w.provider
          ),
        }));

        setWeatherData(mergedData);
      }
    } catch (err) {
      console.error("Error fetching weather data:", err?.message);
      setErrorMessage(
        "Something went wrong while fetching weather data. Please try again later."
      );
    }
  }, [apiUrl]);

  return (
    <div className="container">
      <header className="header">
        <h1>Check Today's Weather</h1>
        <button className="button" onClick={fetchWeather}>
          Fetch Weather Data
        </button>
      </header>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Suspense fallback={<div>Loading weather data...</div>}>
        <WeatherListing
          weatherData={weatherData}
          setWeatherData={setWeatherData}
          errorProviders={errorProviders}
        />
      </Suspense>
    </div>
  );
}
