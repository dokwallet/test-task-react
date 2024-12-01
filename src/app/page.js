import Weather from "@/components/weather/WeatherPage";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Weather App | Check Today's Weather</title>
        <meta
          name="description"
          content="Get the latest weather updates, including temperature, condition, and more. Stay informed with accurate weather forecasts."
        />
      </Head>
      <Weather />
    </>
  );
}
