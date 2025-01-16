# Weather Forecasting App

## Overview
This Weather Forecasting App is a web application that provides real-time weather data, hourly forecasts, and weekly forecasts for a searched location or the user's current location. The app uses multiple APIs to fetch and display weather information in an interactive and visually appealing format.

---

## Features

1. **Search Weather by City**: Enter a city name to get real-time weather information.
2. **Current Location Weather**: Automatically fetches and displays the weather for your current location.
3. **Hourly Forecast**: Provides a 24-hour forecast for the selected location.
4. **Weekly Forecast**: Displays a 7-day weather forecast.
5. **Dynamic Background**: Changes background based on current weather conditions.
6. **Loading Animation**: Displays a loader while fetching data.
7. **Responsive Design**: Works seamlessly across devices of different screen sizes.

---

## Technologies Used

1. **HTML**: For structuring the webpage.
2. **CSS**: For styling and responsiveness.
3. **JavaScript**: For functionality and API integration.
4. **APIs**:
    - [OpenWeather API](https://openweathermap.org/api) for current weather data.
    - [OpenCage Geocoding API](https://opencagedata.com/) for reverse geocoding (current location).
    - [WeatherAPI](https://www.weatherapi.com/) for hourly and weekly forecasts.

---

## Setup Instructions

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/weather-app.git
    ```

2. Navigate to the project directory:
    ```bash
    cd My-Weather-Forecaster
    ```

3. Open the project in your favorite text editor or IDE.

4. Replace the API keys in `script.js`:
    - **OpenWeather API Key**:
      ```javascript
      const apiKey = 'your_openweather_api_key';
      ```
    - **OpenCage Geocoding API Key**:
      ```javascript
      const geocodeApiKey = 'your_opencage_api_key';
      ```
    - **WeatherAPI Key**:
      ```javascript
      const hourlyForecastApiKey = 'your_weatherapi_key';
      ```

5. Run the project:
    - Simply open the `index.html` file in any modern web browser.

---

## File Structure

```
weather-app/
|
|-- index.html       # Main HTML file
|-- style.css        # Stylesheet for the app
|-- script.js        # JavaScript file containing app logic
|-- images/          # Directory for weather condition images
```

---

## Usage

1. Open the application in your browser.
2. Allow location permissions to fetch weather for your current location.
3. Enter a city name in the input box and click `Search` to get weather data for that city.

---

## API Key Configuration

To make the app functional, replace the placeholder API keys in the `script.js` file with your actual keys from the respective providers:

- **OpenWeather API Key** (for current weather data):
  ```javascript
  const apiKey = 'your_openweather_api_key';
  ```

- **OpenCage Geocoding API Key** (for reverse geocoding):
  ```javascript
  const geocodeApiKey = 'your_opencage_api_key';
  ```

- **WeatherAPI Key** (for hourly and weekly forecasts):
  ```javascript
  const hourlyForecastApiKey = 'your_weatherapi_key';
  ```

**Note:** Ensure that the API keys are active and have sufficient quota for the app's usage.

---

## Future Improvements

1. Add error messages for specific error codes from APIs.
2. Implement offline capabilities using service workers.
3. Add more detailed styling for better UI/UX.
4. Enhance background images with animation effects.
5. Integrate more weather metrics such as air quality index.

---

## Acknowledgments

- [OpenWeather](https://openweathermap.org/) for providing weather data.
- [OpenCage](https://opencagedata.com/) for geocoding services.
- [WeatherAPI](https://www.weatherapi.com/) for forecast data.
- [Unsplash](https://unsplash.com/) for background images.

---

## Author

- **Name**: Chowdhury Yasir




