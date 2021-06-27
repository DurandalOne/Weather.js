const mainDIV = document.getElementById("weather");
const textEntry = document.getElementById("weatherEntry");
const textDisplay = document.getElementById("textDisplay");
const submitButton = document.getElementById("submitButton");
const locationButton = document.getElementById("locationButton");
const sevenDayForcast = document.getElementById("sevenDayForcast");
const tempUnits = document.getElementById("tempUnits");
let input = "q=London";
let currentData = [];
let forcastData = [];
let celcius = true;

//Fatory to convert weather JSON into objects
const weatherFactory = function (weatherJSON) {
  return {
    name: weatherJSON.name,
    weather: weatherJSON.weather[0].main,
    description: weatherJSON.weather[0].description,
    temperature: Math.round(weatherJSON.main.temp),
    icon: weatherJSON.weather[0].icon,
    time: weatherJSON.dt,
    timezone: weatherJSON.timezone,
  };
};

//Grabs weather data, uses the JSON to place objects into currentData array. Throws an alert at a 404 error
async function getWeather(location) {
  tempSelector = "metric";
  !celcius && (tempSelector = "imperial");
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${location}&units=${tempSelector}&APPID=775a90e01716794019579760d64f3e7a`
  ).then((response) => {
    if (!response.ok) {
      alert(`The city ${input} cannot be found!`);
      return;
    } else {
      return response;
    }
  });
  const weatherJSON = await weatherData.json();

  // console.log(weatherJSON);

  let lat = weatherJSON.coord.lat;
  let lon = weatherJSON.coord.lon;

  //Uses the latitude and longitude from weatherData JSON to call the OpenWeather One Call API to retrieve 7 day forcast
  const forcastJSON = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${tempSelector}&APPID=775a90e01716794019579760d64f3e7a`
  ).then((response) => {
    if (!response.ok) {
      alert(`The city ${input} cannot be found!`);
      return;
    } else {
      return response;
    }
  });

  const fullForcast = await forcastJSON.json();

  currentData = weatherFactory(weatherJSON);
  input = `q=${weatherJSON.name}`;

  forcastData = [];

  await fullForcast.daily.map((data) => {
    let weatherObject = {
      temp: Math.round(data.temp.day),
      weather: data.weather[0].main,
      icon: data.weather[0].icon,
      day: data.dt,
    };

    forcastData = [...forcastData, weatherObject];
  });
}

const forcastTime = () => {};

//sets the input value to that of the input box
function searchData() {
  input = `q=${textEntry.value}`;
}

const getLocation = async () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    displayData(`lat=${lat}&lon=${lon}`);
  });
};

//listens for enter being pressed in the input box, updates the input variable then updates the DOM
textEntry.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchData();
    displayData(input);
  }
});

submitButton.addEventListener("click", () => {
  searchData();
  displayData(input);
});

locationButton.addEventListener("click", () => {
  getLocation();
});

tempUnits.addEventListener("click", () => {
  celcius = !celcius;
  displayData(input);
});

//Retrieves runs the getWeather functions, followed by amending the DOM with the converted JSON
async function displayData(input) {
  await getWeather(input);

  let unitDisplay;
  celcius ? (unitDisplay = "&deg;C") : (unitDisplay = "&deg;F");

  utcTime = (currentData.time + currentData.timezone) * 1000;

  const format_time = (s) => {
    d1 = new Date(s).toISOString().slice(-13, -8);
    hours = parseInt(d1.substring(0, 2));
    hoursStr = hours.toString();
    if (hours <= 12) {
      d1 = d1.concat(" AM");
    } else {
      hourOffset = (hours - 12).toString();
      d1 = d1.replace(hoursStr, hourOffset).concat(" PM");
    }
    return d1;
  };

  apiTime = format_time(utcTime);

  textDisplay.innerHTML = `
  <p class="weather-info__description">${currentData.weather}<p>
  <p class="weather-info__city">${currentData.name}</p>
  <p class="weather-info__time">${apiTime}</p>
  <p class="weather-info__temperature">${currentData.temperature}${unitDisplay}</p>
  <img src="http://openweathermap.org/img/wn/${currentData.icon}@4x.png" alt="">
  
  `;

  sevenDayForcast.innerHTML = forcastData
    .slice(1)
    .map((data) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayNum = new Date(data.day * 1000).getDay();
      const dayName = days[dayNum];
      return `<div>
      <p>${dayName}</p>
    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
    <p>${data.weather}</p>
    <p>${data.temp}${unitDisplay}</p>
    </div>`;
    })
    .join("");
}

//On DOM load runs displayData with the default input value - London
document.addEventListener(
  "DOMContentLoaded",
  function () {
    displayData(input);
  },
  false
);
