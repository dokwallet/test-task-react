import React from "react";
import { postData } from "../../common/apiHelper";

export default function WeatherListing({
  weatherData,
  setWeatherData,
  errorProviders,
}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
    <div>
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
