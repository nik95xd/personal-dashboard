const themeToggle = document.querySelector("#theme-toggle");
const firstNumberInput = document.querySelector("#first-number");
const secondNumberInput = document.querySelector("#second-number");
const calculatorResult = document.querySelector("#calculator-result");
const operationButtons = document.querySelectorAll("[data-operation]");

const savedTheme = localStorage.getItem("dashboard-theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
    themeToggle.setAttribute("aria-pressed", "true");
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "dark";

    if (isDark) {
        document.documentElement.dataset.theme = "dark";
    } else {
        delete document.documentElement.dataset.theme;
    }

    themeToggle.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("dashboard-theme", isDark ? "dark" : "light");
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const firstValue = firstNumberInput.value;
        const secondValue = secondNumberInput.value;

        if (firstValue === "" || secondValue === "") {
            calculatorResult.textContent = "Enter both numbers to calculate.";
            return;
        }

        const firstNumber = Number(firstValue);
        const secondNumber = Number(secondValue);
        let result;

        switch (button.dataset.operation) {
            case "add":
                result = firstNumber + secondNumber;
                break;
            case "subtract":
                result = firstNumber - secondNumber;
                break;
            case "multiply":
                result = firstNumber * secondNumber;
                break;
            case "divide":
                if (secondNumber === 0) {
                    calculatorResult.textContent = "Cannot divide by zero.";
                    return;
                }
                result = firstNumber / secondNumber;
                break;
            default:
                return;
        }

        calculatorResult.textContent = `Result: ${result}`;
    });
});

const weatherForm = document.querySelector("#weather-form");

if (weatherForm) {
    const latitudeInput = document.querySelector("#latitude");
    const longitudeInput = document.querySelector("#longitude");
    const weatherStatus = document.querySelector("#weather-status");
    const weatherEmpty = document.querySelector("#weather-empty");
    const weatherResult = document.querySelector("#weather-result");
    const weatherSubmit = weatherForm.querySelector("button[type='submit']");

    const weatherDescriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snowfall",
        73: "Moderate snowfall",
        75: "Heavy snowfall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
    };

    weatherForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const latitude = Number(latitudeInput.value);
        const longitude = Number(longitudeInput.value);

        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            weatherStatus.textContent = "Enter a latitude between -90 and 90.";
            latitudeInput.focus();
            return;
        }

        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            weatherStatus.textContent = "Enter a longitude between -180 and 180.";
            longitudeInput.focus();
            return;
        }

        const parameters = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
            temperature_unit: "celsius",
            wind_speed_unit: "kmh",
            timezone: "auto"
        });

        weatherSubmit.disabled = true;
        weatherStatus.textContent = "Loading current weather...";

        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`);
            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.reason || "The weather service could not complete the request.");
            }

            if (!data.current || !data.current_units) {
                throw new Error("The weather service returned incomplete data.");
            }

            const current = data.current;
            const units = data.current_units;
            const weatherDescription = weatherDescriptions[current.weather_code] || "Weather conditions unavailable";

            document.querySelector("#weather-location").textContent = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
            document.querySelector("#weather-description").textContent = weatherDescription;
            document.querySelector("#weather-temperature").textContent = `${current.temperature_2m}${units.temperature_2m}`;
            document.querySelector("#weather-time").textContent = `${current.time.replace("T", " ")} (${data.timezone})`;
            document.querySelector("#weather-feels-like").textContent = `${current.apparent_temperature}${units.apparent_temperature}`;
            document.querySelector("#weather-humidity").textContent = `${current.relative_humidity_2m}${units.relative_humidity_2m}`;
            document.querySelector("#weather-wind").textContent = `${current.wind_speed_10m} ${units.wind_speed_10m}`;
            document.querySelector("#weather-precipitation").textContent = `${current.precipitation} ${units.precipitation}`;

            weatherEmpty.hidden = true;
            weatherResult.hidden = false;
            weatherStatus.textContent = "Weather updated.";
        } catch (error) {
            weatherStatus.textContent = error instanceof TypeError
                ? "Could not connect to Open-Meteo. Check your connection and try again."
                : error.message;
        } finally {
            weatherSubmit.disabled = false;
        }
    });
}