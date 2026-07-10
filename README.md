# Weather Dashboard

Responsive Weather Dashboard that makes use of HTML, CSS, and JavaScript. The dashboard gets weather details and forecasts from the Open-Meteo API.

## Features

- Search weather by the name of the city
- Displaying weather status
- Showing temperature, humidity, wind speed, pressure, and felt temperature
- 24 hour forecast
- 7 day forecast
- Responsive UI
- Error handling in case of wrong city names

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Open-Meteo Weather API
- Open-Meteo Geocoding API

## Project Structure

```
weather-dashboard/
│── index.html
│── style.css
│── script.js
│── README.md
```

## How to Run

1. Download/Clone the repository
2. Navigate into the project directory
3. Open `index.html` in any modern web browser.

No other setup is needed.

## APIs Used

### Geocoding API
This converts the entered city name to lat-long coordinates.

### Open-Meteo Forecast API
Returns:
- Current weather
- Hourly weather forecast
- 7 day forecast

## Features Developed

- Searching for city
- Current weather card
- Hourly forecast card
- 7 day forecast card
- Weather icons
- Responsive UI
- Invalid city error message
- Loading icon
- Toggle between Light Mode and Dark Mode
