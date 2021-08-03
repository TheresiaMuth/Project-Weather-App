let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

let months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const weatherIconMap = {
  "01d": "bi-brightness-high",
  "01n": "bi-moon",
  "02d": "bi-cloud-sun",
  "02n": "bi-cloud-moon",
  "03d": "bi-cloud",
  "03n": "bi-cloud",
  "04d": "bi-clouds",
  "04n": "bi-clouds",
  "09d": "bi-cloud-rain",
  "09n": "bi-cloud-rain",
  "10d": "bi-cloud-drizzle",
  "10n": "bi-cloud-drizzle",
  "11d": "bi-cloud-lightning-rain",
  "11n": "bi-cloud-lightning-rain",
  "13d": "bi-cloud-snow",
  "13n": "bi-cloud-snow",
  "50d": "bi-cloud-haze",
  "50n": "bi-cloud-haze",
};

let apiKey = "76451f6db74c0c91e584bf9b2989b165";

let unit = "metric";

let isFahrenheit = false;

let citySearchForm = document.querySelector("#city-searchbar");

let citySearchFormButton = document.querySelector("#button-go");

let currentLocationButton = document.querySelector("#current-location-button");

function showTemp(temp) {
  return isFahrenheit ? Math.round(calculateCelciusToFahrenheit(temp)) : Math.round(temp);
}

function showCurrentDate() {
  let now = new Date();

  let currentDay = days[now.getDay()];
  let currentMonth = months[now.getMonth()];
  let currentDate = now.getDate();
  let currentHour = now.getHours();
  function currentMinute(now) {
    let formMin = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
    return formMin;
  }

  let dateNow = document.querySelector("#current-date");
  dateNow.innerHTML = `${currentDay} | ${currentMonth} ${currentDate} | ${currentHour}:${currentMinute(now)}`;
}

function showWeatherCurrentDay(response) {
  document.querySelector("#current-temperature").innerHTML = showTemp(response.data.main.temp);
  document.querySelector("#today-max").innerHTML = showTemp(response.data.main.temp_max);
  document.querySelector("#today-min").innerHTML = showTemp(response.data.main.temp_min);
  document.querySelector("#felt-like").innerHTML = showTemp(response.data.main.feels_like);

  document.querySelector("#humidity").innerHTML = Math.round(response.data.main.humidity);
  document.querySelector("#wind-speed").innerHTML = Math.round(response.data.wind.speed * 10) / 10;
  document.querySelector("#current-weather-description").innerHTML = response.data.weather[0].main;

  let icon = document.querySelector("#weather-icon");
  for (const [key, value] of Object.entries(weatherIconMap)) {
    icon.classList.remove(value);
  }
  icon.classList.add(weatherIconMap[response.data.weather[0].icon]);
}

function showAdditionalInformation(response) {
  console.log(response.data);

  let likelihoodOfRain = document.querySelector("#rain-likelihood");
  let UVIndex = document.querySelector("#uv-index");

  likelihoodOfRain.innerHTML = `${Math.round(response.data.hourly[0].pop * 100)}%`;
  UVIndex.innerHTML = `${Math.round(response.data.current.uvi)}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  return days[day];
}

function showWeatherForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col" id="forecast-1">
    <div class="card text-center" id="forecast-1-card">
      <div class="card-body">
        <h5 class="card-title">
           <i class="bi ${weatherIconMap[forecastDay.weather[0].icon]}"></i>
        </h5>
        <p class="card-subtitle mb-2">${formatForecastDay(forecastDay.dt)}</p>
        <p class="card-text">
         <span class="col temp-max"
          ><i class="bi bi-arrow-up"></i>
          <span class="temp">${showTemp(forecastDay.temp.max)}</span>°</span
         >

         <span class="col temp-min"
          ><i class="bi bi-arrow-down"></i>
          <span class="temp">${showTemp(forecastDay.temp.min)}</span>°</span
         >
        </p>
      </div>
    </div>
  </div>
`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getWeatherForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then((response) => {
    showWeatherForecast(response);
    showAdditionalInformation(response);
  });
}

function showCityBySearch() {
  let cityOld = document.querySelector("#current-city");
  let city = document.querySelector("#city-search")?.value;

  cityOld.style.fontSize = "52px";
  cityOld.innerHTML = `${city?.toUpperCase()}`;
}

function showCityByGeo(response) {
  let cityOld = document.querySelector("#current-city");
  let city = response.data.name;

  cityOld.style.fontSize = "52px";
  cityOld.innerHTML = `${city?.toUpperCase()}`;
}

function showDataNotAvailable() {
  let cityOld = document.querySelector("#current-city");
  let city = document.querySelector("#city-search")?.value;

  let weatherData = [
    document.querySelector("#current-temperature"),
    document.querySelector("#today-max"),
    document.querySelector("#today-min"),
    document.querySelector("#felt-like"),
    document.querySelector("#humidity"),
    document.querySelector("#wind-speed"),
    document.querySelector("#current-weather-description"),
  ];

  cityOld.style.fontSize = "28px";
  cityOld.innerHTML = `NO DATA AVAILABLE FOR ${city?.toUpperCase()}`;

  weatherData.forEach((elem) => (elem.innerHTML = "-"));

  let icon = document.querySelector("#weather-icon");
  for (const [key, value] of Object.entries(weatherIconMap)) {
    icon.classList.remove(value);
  }
}

function displaySearchIcon() {
  let citySearchFormValue = document.querySelector("#city-search")?.value;

  if (citySearchFormValue) {
    citySearchFormButton.style.visibility = "visible";
  } else {
    citySearchFormButton.style.visibility = "hidden";
  }
}

function resetSearchForm() {
  let citySearchFormInput = document.querySelector("#city-search");
  citySearchFormInput.value = "";
  displaySearchIcon();
}

function selectCityBySearch(event) {
  event.preventDefault();
  let city = document.querySelector("#city-search")?.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios
    .get(apiUrl)
    .then((response) => {
      showWeatherCurrentDay(response);
      showCityBySearch(response);
      showCurrentDate();
      getWeatherForecast(response.data.coord);
      resetSearchForm();
    })
    .catch((error) => {
      showDataNotAvailable();
      showCurrentDate();
      console.error(error);
      resetSearchForm();
    });
}

function selectCityByGeo(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

  axios
    .get(apiUrl)
    .then((response) => {
      showWeatherCurrentDay(response);
      showCityByGeo(response);
      showCurrentDate();
      getWeatherForecast(response.data.coord);
      resetSearchForm();
    })
    .catch((error) => {
      showDataNotAvailable();
      showCurrentDate();
      console.error(error);
      resetSearchForm();
    });
}

function loadStartingPage() {
  let city = "München";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then((response) => {
    showWeatherCurrentDay(response);
    showCityByGeo(response);
    showCurrentDate();
    getWeatherForecast(response.data.coord);
  });
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(selectCityByGeo);
}

citySearchForm.addEventListener("submit", selectCityBySearch);

citySearchFormButton.addEventListener("click", selectCityBySearch);

currentLocationButton.addEventListener("click", getCurrentPosition);

loadStartingPage();

//Change Temperature Unit
function calculateFahrenheitToCelcius(tempFahrenheit) {
  return ((tempFahrenheit - 32) * 5) / 9;
}

function calculateCelciusToFahrenheit(tempCelcius) {
  return (tempCelcius * 9) / 5 + 32;
}

function selectCelcius(event) {
  event.preventDefault();
  isFahrenheit = false;

  let fahrenheit = document.querySelector("#select-f");
  fahrenheit.classList.remove("disable", "selectedUnit");
  event.target.classList.add("disable", "selectedUnit");
  event.target.removeEventListener("click", selectCelcius);
  fahrenheit.addEventListener("click", selectFahrenheit);

  displayTemperatureAsCelcius();
}

function displayTemperatureAsCelcius() {
  document.querySelectorAll(".temp").forEach((element) => {
    let tempInt = parseInt(element.innerHTML, 10);
    element.innerHTML = Math.round(calculateFahrenheitToCelcius(tempInt));
  });
}

function selectFahrenheit(event) {
  event.preventDefault();
  isFahrenheit = true;

  let celcius = document.querySelector("#select-c");
  celcius.classList.remove("disable", "selectedUnit");
  event.target.classList.add("disable", "selectedUnit");
  event.target.removeEventListener("click", selectFahrenheit);
  celcius.addEventListener("click", selectCelcius);

  displayTemperatureAsFahrenheit();
}

function displayTemperatureAsFahrenheit() {
  document.querySelectorAll(".temp").forEach((element) => {
    let tempInt = parseInt(element.innerHTML, 10);
    element.innerHTML = Math.round(calculateCelciusToFahrenheit(tempInt));
  });
}

let fahrenheit = document.querySelector("#select-f");
fahrenheit.addEventListener("click", selectFahrenheit);
