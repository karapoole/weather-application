// Setting up local storage
let currentForecastStorage =
  JSON.parse(localStorage.getItem("currentForecast")) || "";
let fiveDayForecastStorage =
  JSON.parse(localStorage.getItem("fiveDayForecast")) || [];
let searchHistoryStorage =
  JSON.parse(localStorage.getItem("searchHistory")) || [];

//function to get an return latitue and longitue of city
async function handleCoordinates(city) {
  let latlon = [];
  const apiKey = "59d674a8299ce106ece15287cf479fbc";
  //URL needed for API request
  const coordinateUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;

  //API call to get longitute and latitude of city
  //await = pause for API request to complete
  await fetch(coordinateUrl)
    //caputures response from API
    .then(function (response) {
      //returns response as a JSON
      return response.json();
    })

    .then(function (data) {
      //traversing into JSON to get latitute and longitude, push onto empty array
      latlon.push(data[0].lat);
      latlon.push(data[0].lon);
    });
  //returns array with latitude and longitude
  return latlon;
}

//fuction to get and return 5 day forecast for city using latitude and longitude from above
async function handleForecast(lat, lon) {
  const apiKey = "59d674a8299ce106ece15287cf479fbc";

  let forcastUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey +
    "&units=imperial";

  //variable to hold response from forecast API call
  let foreCast;
  await fetch(forcastUrl)
    //gets response from fetch call
    .then(function (response) {
      //makes fetch into JSON
      return response.json();
    })
    //recieves response as JSON
    .then(function (data) {
      //sets local variable to response JSON
      foreCast = data;
    });
  //returns forecast JSON
  return foreCast;
}

async function handleCitySearch(event) {
  event.preventDefault();

  const city = $("#inputCity").val();

  let coordinates = await handleCoordinates(city);
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  //passes latitdue and longitude to get forecast data
  let forecast = await handleForecast(latitude, longitude);
  handleForecardCards(forecast);

  const searchHistoryBtn = {
    city: forecast.city.name,
    lat: latitude,
    lon: longitude,
  };

  searchHistoryStorage.push(searchHistoryBtn);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryStorage));
  loadSearchHistoryButtons();
  $("#inputCity").val("");
}

async function handleSearchHistoryCitySearch(event) {
  event.preventDefault();

  const searchHistoryBtn = $(event.currentTarget);
  const latitude = searchHistoryBtn.data("latitude");
  const longitude = searchHistoryBtn.data("longitude");

  let forecast = await handleForecast(latitude, longitude);
  handleForecardCards(forecast);
}

function handleForecardCards(forecast) {
  const currentForecastDetails = {
    city: forecast.city.name,
    icon: forecast.list[0].weather[0].icon,
    date: forecast.list[0].dt_txt,
    temperature: Math.round(forecast.list[0].main.temp),
    wind: forecast.list[0].wind.speed,
    humidity: forecast.list[0].main.humidity,
  };

  currentForecastStorage = currentForecastDetails;
  // Set current forecast information into local storage
  localStorage.setItem(
    "currentForecast",
    JSON.stringify(currentForecastStorage)
  );

  loadCurrentForecastCard();

  // Loading five day forecast information to localStorage
  fiveDayForecastStorage = [];

  for (let i = 7; i < forecast.list.length; i += 8) {
    const fiveDayForecastDetail = {
      icon: forecast.list[i].weather[0].icon,
      date: forecast.list[i].dt_txt,
      temperature: Math.round(forecast.list[i].main.temp),
      wind: forecast.list[i].wind.speed,
      humidity: forecast.list[i].main.humidity,
    };

    // adds forecast information on the end of list
    fiveDayForecastStorage.push(fiveDayForecastDetail);
  }
  localStorage.setItem(
    "fiveDayForecast",
    JSON.stringify(fiveDayForecastStorage)
  );
  loadFiveDayForecastCard();
}

function loadSearchHistoryButtons() {
  $(".history-btns").empty();
  if (searchHistoryStorage.length < 1) {
    return;
  } else {
    for (let i = 0; i < searchHistoryStorage.length; i++) {
      const historyBtn = $("<button>");
      historyBtn.text(searchHistoryStorage[i].city);
      historyBtn.attr("data-latitude", searchHistoryStorage[i].lat);
      historyBtn.attr("data-longitude", searchHistoryStorage[i].lon);
      historyBtn.addClass("btn search-history");
      $(".history-btns").append(historyBtn);
    }
  }
  $(".search-history").on("click", handleSearchHistoryCitySearch);
}

function loadCurrentForecastCard() {
  if (currentForecastStorage === "") {
    return;
  } else {
    $(".forecast-card").empty();

    //creates box around forecast card
    const cardBody = $("<div>");
    cardBody.css("border", "3px solid black");
    cardBody.css("border-width", "5px");
    cardBody.css("marginTop", "10px");
    cardBody.css("padding", "30px");

    // creates paragraph element in card, adds class for card city, creates text for city
    const cardCity = $("<h3>");
    cardCity.addClass("card-city");
    cardCity.text(currentForecastStorage.city);

    // creates paragraph element in card, adds class for card date, creates text for date
    const cardDate = $("<h5>");
    cardDate.addClass("card-date");
    let date = currentForecastStorage.date.split(" ");
    cardDate.text(dayjs(date[0]).format("MM/DD/YYYY"));

    // creates paragraph element in card, adds class for card temperature, creates text for temperature
    const cardTemperature = $("<p>");
    cardTemperature.addClass("card-temperature");
    cardTemperature.text(
      "Temperature: " + currentForecastStorage.temperature + "\u00B0"
    );

    // creates paragraph element in card, adds class for card emoji, creates text for emoji
    const cardImage = $("<img>");
    cardImage.addClass("card-image");
    cardImage.attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        currentForecastStorage.icon +
        "@2x.png"
    );

    // creates paragraph element in card, adds class for card wind, creates text for wind
    const cardWind = $("<p>");
    cardWind.addClass("card-wind");
    cardWind.text("Wind Speed: " + currentForecastStorage.wind + " mph");

    // creates paragraph element in card, adds class for card humidity, creates text for humidity
    const cardHumidity = $("<p>");
    cardHumidity.addClass("card-humidity");
    cardHumidity.text("Humidity: " + currentForecastStorage.humidity + "%");

    // appends card title, card text, card deadline, card delete button, and card body
    cardBody.append(cardCity);
    cardBody.append(cardDate);
    cardBody.append(cardImage);
    cardBody.append(cardTemperature);
    cardBody.append(cardWind);
    cardBody.append(cardHumidity);
    $(".forecast-card").append(cardBody);
  }
}

// TODO function to create current forecast card
function loadFiveDayForecastCard() {
  $(".five-day").empty();

  for (let i = 0; i < fiveDayForecastStorage.length; i++) {
    const cardBody = $("<div>");
    //creates box around forecast card
    cardBody.css("border", "3px solid black");
    cardBody.css("background-color", "navy");
    cardBody.css("color", "white");

    cardBody.css("border-width", "5px");
    cardBody.css("marginTop", "10px");
    cardBody.css("padding", "30px");

    // creates paragraph element in card, adds class for card date, creates text for date
    const cardDate = $("<h5>");
    cardDate.addClass("card-date");
    let date = fiveDayForecastStorage[i].date.split(" ");
    cardDate.text(dayjs(date[0]).format("MM/DD/YYYY"));

    // creates paragraph element in card, adds class for card emoji, creates text for emoji
    const cardImage = $("<img>");
    cardImage.addClass("card-image");
    cardImage.attr(
      "src",
      "https://openweathermap.org/img/wn/" +
        fiveDayForecastStorage[i].icon +
        "@2x.png"
    );

    // creates paragraph element in card, adds class for card temperature, creates text for temperature
    const cardTemperature = $("<p>");
    cardTemperature.addClass("card-temperature");
    cardTemperature.text(
      "Temperature: " + fiveDayForecastStorage[i].temperature + "\u00B0"
    );

    // creates paragraph element in card, adds class for card wind, creates text for wind
    const cardWind = $("<p>");
    cardWind.addClass("card-wind");
    cardWind.text("Wind Speed: " + fiveDayForecastStorage[i].wind + " mph");

    // creates paragraph element in card, adds class for card humidity, creates text for humidity
    const cardHumidity = $("<p>");
    cardHumidity.addClass("card-humidity");
    cardHumidity.text("Humidity: " + fiveDayForecastStorage[i].humidity + "%");

    // appends card title, card text, card deadline, card delete button, and card body
    cardBody.append(cardDate);
    cardBody.append(cardImage);
    cardBody.append(cardTemperature);
    cardBody.append(cardWind);
    cardBody.append(cardHumidity);
    $(".five-day").append(cardBody);
  }
}

$(document).ready(function () {
  loadCurrentForecastCard();
  loadFiveDayForecastCard();
  loadSearchHistoryButtons();
  $("#cityInput").on("submit", handleCitySearch);
  $(".search-history").on("click", handleSearchHistoryCitySearch);
});
