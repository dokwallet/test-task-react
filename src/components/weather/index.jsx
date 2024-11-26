"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import "../../css/weather.css";
import { fetchData, postData } from "../common/apiHelper";

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

  const togglePin = async (weather, isPinned) => {
    try {
      const { city, temperature, condition, provider } = weather;
      await postData(`${apiUrl}/api/weather/togglePin`, {
        provider,
        city,
        temperature,
        condition,
        isPinned: isPinned,
      });
      setWeatherData((prevData) =>
        prevData.map((data) =>
          data.provider === provider ? { ...data, pinned: !isPinned } : data
        )
      );
    } catch (err) {
      console.error("Error toggling pin:", err?.message);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Check Today's Weather</h1>
        <button className="button" onClick={fetchWeather}>
          Fetch Weather Data
        </button>
      </header>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="weatherTable">
        <thead>
          <tr>
            <th>Provider</th>
            <th>City</th>
            <th>Temperature</th>
            <th>Condition</th>
            <th>Pinned</th>
          </tr>
        </thead>
        <tbody>
          {weatherData
            .sort((a, b) => (b.pinned ? 1 : -1))
            .map((weather, index) => (
              <tr key={index} className={weather?.pinned ? "pinnedRow" : ""}>
                <td>{weather?.provider}</td>
                <td>{weather?.city}</td>
                <td>
                  {weather?.temperature ? `${weather?.temperature} °C` : "N/A"}
                </td>
                <td>{weather?.condition}</td>
                <td>
                  <button onClick={() => togglePin(weather, weather?.pinned)}>
                    {weather?.pinned ? "Unpin" : "Pin"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {errorProviders.length > 0 && (
        <section className="errorSection">
          <h2>Failed Providers</h2>
          <ul>
            {errorProviders.map((error, index) => (
              <li key={index} className="errorItem">
                <span>{error?.provider}</span>:{" "}
                <span>{error?.errorMessage}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
