const apiKey = 'your_openweather_api_key';; // use your openweather api key
const geocodeApiKey = 'your_opencage_api_key'; // use your geocode api key
const hourlyForecastApiKey = 'your_weatherapi_key'; // use your weather api key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geocodeApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
const hourlyApiUrl = `https://api.weatherapi.com/v1/forecast.json`;

// HTML elements
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const feelsLikeElement = document.getElementById('feelsLike');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const visibilityElement = document.getElementById('visibility');
const pressureElement = document.getElementById('pressure');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
const errorMessageElement = document.getElementById('error-message');
const weatherIconElement = document.getElementById('weatherIcon');
const weeklyForecastElement = document.getElementById('weekly-forecast');

// Elements for displaying current location weather
const currentLocationElement = document.getElementById('current-location');
const currentTempElement = document.getElementById('current-temp');
const currentDescriptionElement = document.getElementById('current-description');
const currentWeatherIconElement = document.getElementById('current-weather-icon');

// Loader element
const loader = document.getElementById('loader');

// Function to show the loader
function showLoader() {
    loader.style.display = 'block';
}

// Function to hide the loader
function hideLoader() {
    loader.style.display = 'none';
}

// Fetch weather for a searched location
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location, true); // true to indicate it's a search
    } else {
        displayErrorMessage("Please enter a city name.");
    }
});

// Fetch current location weather on page load
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchCurrentLocationWeather(lat, lon);
            },
            error => {
                console.error('Error getting location:', error);
                displayCurrentLocationError("Unable to retrieve your current location.");
            }
        );
    } else {
        displayCurrentLocationError("Geolocation is not supported by this browser.");
    }
});

// Function to fetch weather for a searched city name
function fetchWeather(location, isSearch = false) {
    showLoader(); // Show loader when fetching starts
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`City not found or error with status code: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data for searched location:', data);
            displayWeatherData(data); // Show weather data for searched location
            clearErrorMessage(); // Clear any previous error messages from the search
            if (isSearch) {
                updateBackground(data.weather[0].main); // Update background based on searched location weather
            }

            // Fetch hourly and weekly forecast using WeatherAPI
            fetchHourlyForecastWeatherAPI(location);
            fetchWeeklyForecast(location);
        })
        .catch(error => {
            console.error('Error fetching weather data for search:', error);
            displayErrorMessage("An error occurred while fetching the weather data for the city.");
            clearWeatherData();
        })
        .finally(() => {
            hideLoader(); // Hide loader when fetching ends
        });
}

// Function to fetch current location weather based on coordinates
function fetchCurrentLocationWeather(lat, lon) {
    showLoader(); // Show loader when fetching starts
    const geocodeUrl = `${geocodeApiUrl}?q=${lat}+${lon}&key=${geocodeApiKey}`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const components = data.results[0].components;
            const cityName = components.city || components.town || components.village || components.state;
            currentLocationElement.textContent = cityName;

            // Fetch weather data for the coordinates
            const weatherUrl = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            return fetch(weatherUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching weather for current location with status code: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data for current location:', data);
            displayCurrentLocationWeather(data);
            updateBackground(data.weather[0].main); // Update background based on current location weather

            // Fetch hourly and weekly forecast using WeatherAPI
            fetchHourlyForecastWeatherAPI(currentLocationElement.textContent); // Use city name for hourly forecast
            fetchWeeklyForecast(currentLocationElement.textContent);
        })
        .catch(error => {
            console.error('Error fetching current location weather:', error);
            displayCurrentLocationError("An error occurred while fetching your current location weather.");
        })
        .finally(() => {
            hideLoader(); // Hide loader when fetching ends
        });
}

// Function to fetch hourly forecast using WeatherAPI.com
function fetchHourlyForecastWeatherAPI(location) {
    const url = `${hourlyApiUrl}?key=${hourlyForecastApiKey}&q=${location}&days=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayHourlyForecast(data.forecast.forecastday[0].hour))
        .catch(error => console.error('Error fetching hourly forecast:', error));
}

// Function to fetch weekly forecast using WeatherAPI.com
function fetchWeeklyForecast(location) {
    const url = `${hourlyApiUrl}?key=${hourlyForecastApiKey}&q=${location}&days=7`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeeklyForecast(data.forecast.forecastday))
        .catch(error => console.error('Error fetching weekly forecast:', error));
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastElement = document.getElementById('hourly-forecast');
    hourlyForecastElement.innerHTML = ''; // Clear previous forecast

    const now = new Date();
    const currentHour = now.getHours();
    let startIndex = hourlyData.findIndex(hourData => new Date(hourData.time).getHours() === currentHour);

    if (startIndex === -1) startIndex = 0;

    for (let i = 0; i < 24; i++) {
        const hourData = hourlyData[(startIndex + i) % hourlyData.length];
        const hourElement = document.createElement('div');
        hourElement.classList.add('hour');

        const time = new Date(hourData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        hourElement.innerHTML += `<p>${time}</p>`;
        const temp = `${Math.round(hourData.temp_c)}°C`;
        hourElement.innerHTML += `<p>${temp}</p>`;
        const iconUrl = `https:${hourData.condition.icon}`;
        hourElement.innerHTML += `<img src="${iconUrl}" alt="Weather icon">`;

        if (hourData.chance_of_rain) {
            const pop = `${hourData.chance_of_rain}%`;
            hourElement.innerHTML += `<p>${pop} rain</p>`;
        }

        hourlyForecastElement.appendChild(hourElement);
    }
}

// Function to display weekly forecast
function displayWeeklyForecast(dailyData) {
    weeklyForecastElement.innerHTML = ''; // Clear previous forecast

    dailyData.forEach(dayData => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        const date = new Date(dayData.date);
        const options = { weekday: 'short' };
        const dayName = date.toLocaleDateString(undefined, options);
        dayElement.innerHTML += `<p>${dayName}</p>`;

        const tempHigh = `${Math.round(dayData.day.maxtemp_c)}°C`;
        const tempLow = `${Math.round(dayData.day.mintemp_c)}°C`;
        dayElement.innerHTML += `<p>High: ${tempHigh}</p>`;
        dayElement.innerHTML += `<p>Low: ${tempLow}</p>`;

        const iconUrl = `https:${dayData.day.condition.icon}`;
        dayElement.innerHTML += `<img src="${iconUrl}" alt="Weather icon">`;

        weeklyForecastElement.appendChild(dayElement);
    });
}

// Display weather data for searched location
function displayWeatherData(data) {
    locationElement.textContent = data.name;
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = data.weather[0].description;
    feelsLikeElement.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    visibilityElement.textContent = `Visibility: ${(data.visibility / 1000).toFixed(1)} km`;
    pressureElement.textContent = `Pressure: ${data.main.pressure} hPa`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    sunriseElement.textContent = `Sunrise: ${sunrise}`;
    sunsetElement.textContent = `Sunset: ${sunset}`;

    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.style.display = 'inline';
}

// Display current location weather in separate section
function displayCurrentLocationWeather(data) {
    currentTempElement.textContent = `${Math.round(data.main.temp)}°C`;
    currentDescriptionElement.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    currentWeatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    currentWeatherIconElement.style.display = 'inline';
}

// Function to update the background based on weather condition
function updateBackground(weatherCondition) {
    document.body.classList.remove(
        'clear-sky', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 
        'mist', 'fog', 'haze', 'dust', 'sand', 'ash', 'squall', 'tornado'
    );

    switch (weatherCondition) {
        case 'Clear': document.body.classList.add('clear-sky'); break;
        case 'Clouds': document.body.classList.add('clouds'); break;
        case 'Rain': document.body.classList.add('rain'); break;
        case 'Drizzle': document.body.classList.add('drizzle'); break;
        case 'Thunderstorm': document.body.classList.add('thunderstorm'); break;
        case 'Snow': document.body.classList.add('snow'); break;
        case 'Mist':
        case 'Fog':
        case 'Haze': document.body.classList.add('mist'); break;
        case 'Dust':
        case 'Sand': document.body.classList.add('dust'); break;
        case 'Ash': document.body.classList.add('ash'); break;
        case 'Squall': document.body.classList.add('squall'); break;
        case 'Tornado': document.body.classList.add('tornado'); break;
        default: document.body.classList.add('clear-sky'); break;
    }
}

// Display error message for search functionality
function displayErrorMessage(message) {
    errorMessageElement.textContent = message;
}

// Display error for current location weather
function displayCurrentLocationError(message) {
    currentLocationElement.textContent = message;
}

// Clear weather data for search input
function clearWeatherData() {
    locationElement.textContent = '';
    temperatureElement.textContent = '';
    descriptionElement.textContent = '';
    feelsLikeElement.textContent = '';
    humidityElement.textContent = '';
    windSpeedElement.textContent = '';
    visibilityElement.textContent = '';
    pressureElement.textContent = '';
    sunriseElement.textContent = '';
    sunsetElement.textContent = '';
    weatherIconElement.style.display = 'none';
}

// Clear error messages
function clearErrorMessage() {
    errorMessageElement.textContent = '';
}
