// Map WMO weather codes to weather icons
function getWeatherIcon(code) {
  const icons = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };
  return icons[code] || "⛅";
}

// Convert WMO weather codes into readable weather descriptions
function getWeatherDescription(code) {
  const description = {
    0: "Clear sky",
    1: "Clear sky",
    2: "Few clouds",
    3: "Few clouds",
    45: "Fog",
    48: "Fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    80: "Shower rain",
    81: "Shower rain",
    82: "Thunderstorm",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };
  return description[code] || "Unknown";
}

// Open-Meteo API endpoints
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// Find the latitude and longitude of the searched city
async function getCoordinates(city) {
  const response = await fetch(
    `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
  );

  const geocodingData = await response.json();

  // Stop execution if the city cannot be found
  if (!geocodingData.results || geocodingData.results.length === 0) {
    throw new Error("City not found");
  }

  return {
    lat: geocodingData.results[0].latitude,
    lon: geocodingData.results[0].longitude,
    name: geocodingData.results[0].name,
    country: geocodingData.results[0].country,
  };
}

// Retrieve current, hourly, and daily weather data
async function getWeather(lat, lon) {
  const response = await fetch(
    `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  return await response.json();
}

// Update the current weather section with API data
function updateCurrentWeather(location, weather) {
  const currentWeather = weather.current;

  document.getElementById("location").textContent =
    `${location.name}, ${location.country}`;
  document.getElementById("date").textContent = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  document.getElementById("currentIcon").textContent = getWeatherIcon(
    currentWeather.weather_code,
  );
  document.getElementById("temperature").textContent =
    `${Math.round(currentWeather.temperature_2m)}°C`;
  document.getElementById("description").textContent = getWeatherDescription(
    currentWeather.weather_code,
  );
  document.getElementById("feelsLike").textContent =
    `${Math.round(currentWeather.apparent_temperature)}°C`;
  document.getElementById("humidity").textContent =
    `${currentWeather.relative_humidity_2m}%`;
  document.getElementById("windSpeed").textContent =
    `${Math.round(currentWeather.wind_speed_10m)} m/s`;
  document.getElementById("pressure").textContent =
    `${Math.round(currentWeather.pressure_msl)} hPa`;
}

// Generate hourly forecast cards dynamically
function updateHourlyForecast(weather) {
  const hourly = weather.hourly;
  const container = document.getElementById("hourlyForecast");
  container.innerHTML = "";

  // Display the next 24 hours
  for (let i = 0; i < 24; i++) {
    const time = new Date(hourly.time[i]);
    const hourlyCard = document.createElement("div");
    hourlyCard.className = "hourly-item";
    hourlyCard.innerHTML = `
                    <div class="time">${time.getHours()}:00</div>
                    <div class="icon">${getWeatherIcon(hourly.weather_code[i])}</div>
                    <div class="temp">${Math.round(hourly.temperature_2m[i])}°C</div>
                    `;
    container.appendChild(hourlyCard);
  }
}

// Generate the 7-day forecast cards
function updateDailyForecast(weather) {
  const daily = weather.daily;
  const container = document.getElementById("dailyForecast");
  container.innerHTML = "";

  // Display the next 7 days
  for (let i = 0; i < 7; i++) {
    const data = new Date(daily.time[i]);
    const dayName = data.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const dailyCard = document.createElement("div");
    dailyCard.className = "daily-item";
    dailyCard.innerHTML = `
                    <div class="day">${i === 0 ? "Today" : dayName}</div>
                    <div class="icon">${getWeatherIcon(daily.weather_code[i])}</div>
                    <div class="temp">
                        <span class="temp-max">${Math.round(daily.temperature_2m_max[i])}°</span>
                        <span class="temp-min">${Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>
                `;
    container.appendChild(dailyCard);
  }
}

// Handle city search and update the dashboard
async function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    return;
  }

  showLoading(); // Hide previous results and show loading indicator

  try {
    const location = await getCoordinates(city);
    const weather = await getWeather(location.lat, location.lon);

    updateCurrentWeather(location, weather);
    updateHourlyForecast(weather);
    updateDailyForecast(weather);

    showContent();
  } catch (error) {
    showError(
      error.message || "Failed to fetch weather data. Please try again later",
    );
  }
}

// Display the loading state while the API request is in progress
function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("weatherContent").style.display = "none";
  document.getElementById("errorMsg").style.display = "none";
}

// Display the weather dashboard after successful data retrieval
function showContent() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("weatherContent").style.display = "block";
  document.getElementById("errorMsg").style.display = "none";
}

// Display an error message if the request fails
function showError(message) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("weatherContent").style.display = "none";

  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
}

// Toggle between light and dark mode
function toggleTheme() {
  const button = document.getElementById("themeToggle");

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    button.textContent = "☀️";
  } else {
    button.textContent = "🌙";
  }
}

// Search when the user presses the Enter key
document
  .getElementById("cityInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchWeather();
    }
  });

searchWeather();
