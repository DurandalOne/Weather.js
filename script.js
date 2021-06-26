const mainDIV = document.getElementById("weather");
const textEntry = document.getElementById("weatherEntry");
const textDisplay = document.getElementById("textDisplay");
const submitButton = document.getElementById("submitButton");
const locationButton = document.getElementById("locationButton");
const sevenDayForcast = document.getElementById("sevenDayForcast");
let input = "q=London";
let currentData = [];
let forcastData = [];

//Fatory to convert weather JSON into objects
const weatherFactory = function (weatherJSON) {
  return {
    name: weatherJSON.name,
    weather: weatherJSON.weather[0].main,
    description: weatherJSON.weather[0].description,
    temperature: Math.round(weatherJSON.main.temp),
    icon: weatherJSON.weather[0].icon,
    timezone: weatherJSON.timezone,
  };
};

//Grabs weather data, uses the JSON to place objects into currentData array. Throws an alert at a 404 error
async function getWeather(location) {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${location}&units=metric&APPID=775a90e01716794019579760d64f3e7a`
  ).then((response) => {
    if (!response.ok) {
      alert(`The city ${input} cannot be found!`);
      return;
    } else {
      return response;
    }
  });
  const weatherJSON = await weatherData.json();

  console.log(weatherJSON);

  let lat = weatherJSON.coord.lat;
  let lon = weatherJSON.coord.lon;

  //Uses the latitude and longitude from weatherData JSON to call the OpenWeather One Call API to retrieve 7 day forcast
  const forcastJSON = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&APPID=775a90e01716794019579760d64f3e7a`
  ).then((response) => {
    if (!response.ok) {
      alert(`The city ${input} cannot be found!`);
      return;
    } else {
      return response;
    }
  });

  const fullForcast = await forcastJSON.json();

  console.log(fullForcast);

  currentData = weatherFactory(weatherJSON);
  input = `q=${weatherJSON.name}`;

  forcastData = [];

  await fullForcast.daily.map((data) => {
    let weatherObject = {
      temp: Math.round(data.temp.day),
      weather: data.weather[0].main,
      icon: data.weather[0].icon,
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

//Retrieves runs the getWeather functions, followed by amending the DOM with the converted JSON
async function displayData(input) {
  await getWeather(input);
  textDisplay.innerHTML = `<h2>${currentData.name}</h2>
  <img src="http://openweathermap.org/img/wn/${currentData.icon}@2x.png" alt="">
  <p>Current Weather: ${currentData.weather}<p>
  <p>Current Temperature: ${currentData.temperature}</p>`;

  sevenDayForcast.innerHTML = forcastData
    .map((data) => {
      return `<div>
    <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
    <p>${data.weather}</p>
    <p>${data.temp}C</p>
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
