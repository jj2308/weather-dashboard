import React, { useState, useEffect } from "react";

const iconMap = {
  Clear: "/icons/weather/clear-day.svg",
  Clouds: "/icons/weather/cloudy.svg",
  Rain: "/icons/weather/extreme-rain.svg",
  Drizzle: "/icons/weather/partly-cloudy-day-drizzle.svg",
  Thunderstorm: "/icons/weather/thunderstorms-extreme.svg",
  Snow: "/icons/weather/snow.svg",
  Mist: "/icons/weather/mist.svg",
  Haze: "/icons/weather/haze-day.svg",
  Fog: "/icons/weather/fog.svg",
  Smoke: "/icons/weather/fog.svg",
  Sand: "/icons/weather/fog.svg",
  Ash: "/icons/weather/fog.svg",
  Dust: "/icons/weather/fog.svg",
  Squall: "/icons/weather/extreme-rain.svg",
  Tornado: "/icons/weather/thunderstorms-extreme.svg"
};

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "f511676a1c957533cd9267181a5cffce";

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    if (savedMode) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            setLoading(true);
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = await res.json();
            if (res.ok) {
              setWeatherData(data);
              setCity(data.name);
            } else setError("Unable to fetch location weather");
          } catch {
            setError("Geolocation weather fetch failed");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
          setError("Please allow location access.");
        }
      );
    } else setError("Geolocation not supported by your browser.");
  }, []);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        )
      ]);
      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();
      if (weatherRes.ok && forecastRes.ok) {
        setWeatherData(weatherJson);
        const daily = forecastJson.list.filter((f) =>
          f.dt_txt.includes("12:00:00")
        );
        setForecastData(daily);
      } else {
        setError(weatherJson.message || "City not found");
        setWeatherData(null);
        setForecastData([]);
      }
    } catch {
      setError("Something went wrong");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundClass = () => {
    if (!weatherData) return "from-sky-200 to-rose-200 animate-clouds";
    const condition = weatherData.weather[0].main.toLowerCase();
    switch (condition) {
      case "clear": return "from-yellow-100 to-orange-300 animate-sun";
      case "clouds": return "from-gray-200 to-gray-400 animate-clouds";
      case "rain":
      case "drizzle":
      case "thunderstorm": return "from-blue-400 to-blue-800 animate-rain";
      case "snow": return "from-white to-blue-100 animate-snow";
      case "mist":
      case "fog":
      case "haze":
      case "smoke":
      case "ash":
      case "sand":
      case "dust": return "from-gray-300 to-gray-500 animate-clouds";
      default: return "from-sky-200 to-rose-200";
    }
  };

  const now = new Date().toLocaleString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-r ${getBackgroundClass()} p-4 transition-colors duration-700`}>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">
          🌤 Weather Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{now}</p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Get Weather
          </button>
        </div>

        {weatherData && (
          <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-xl shadow-lg p-6 w-80 text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{weatherData.name}</h2>
            <img
              src={iconMap[weatherData.weather[0].main] || iconMap['Clear']}
              alt={weatherData.weather[0].description || 'Weather icon'}
              className="mx-auto w-24 h-24"
            />
            <p className="text-gray-600 dark:text-gray-300 text-lg capitalize">{weatherData.weather[0].description}</p>
            <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">{Math.round(weatherData.main.temp)}°C</p>
            <div className="mt-4 flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>Wind: {weatherData.wind.speed} m/s</p>
            </div>
          </div>
        )}

        {forecastData.length > 0 && (
          <div className="mt-10 w-full max-w-4xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-center">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.map((day) => (
                <div
                  key={day.dt}
                  className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-lg shadow p-4 text-center animate-fadeIn"
                >
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <img
                    src={iconMap[day.weather[0].main] || iconMap['Clear']}
                    alt={day.weather[0].description || 'Forecast icon'}
                    className="mx-auto w-12 h-12"
                  />
                  <p className="capitalize text-gray-600 dark:text-gray-300 text-sm">{day.weather[0].description}</p>
                  <p className="text-lg font-bold mt-2 text-gray-900 dark:text-white">{Math.round(day.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-white mt-4 animate-pulse">Fetching weather...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default App;