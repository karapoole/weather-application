// Sets up local storage for current forecast, five day forecast, and search history
let currentForecastStorage =
  JSON.parse(localStorage.getItem("currentForecast")) || "";
let fiveDayForecastStorage =
  JSON.parse(localStorage.getItem("fiveDayForecast")) || [];
let searchHistoryStorage =
  JSON.parse(localStorage.getItem("searchHistory")) || [];

//Returns latitue and longitue of city
async function handleCoordinates(city) {
  let latlon = [];
  const apiKey = "59d674a8299ce106ece15287cf479fbc";
  //URL needed for API request
  const coordinateUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
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

//fuction returns 5 day forecast for city using latitude and longitude from above
async function handleForecast(lat, lon) {
  const apiKey = "59d674a8299ce106ece15287cf479fbc";

  let forcastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
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

//function runs forecast call when user inputs city in search box
async function handleCitySearch(event) {
  event.preventDefault();

  //retrieves user input from search box
  const city = $("#inputCity").val();

  //call to get coordinates
  let coordinates = await handleCoordinates(city);
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  //passes latitdue and longitude to get forecast data
  let forecast = await handleForecast(latitude, longitude);
  //create current and fiveday forecast cards
  handleForecardCards(forecast);

  //creates the information for search history button
  const searchHistoryBtn = {
    city: forecast.city.name,
    lat: latitude,
    lon: longitude,
  };

  //adds search history information to local storage
  searchHistoryStorage.push(searchHistoryBtn);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistoryStorage));
  //loads search histroy buttons from local storage
  loadSearchHistoryButtons();
  //empties search box
  $("#inputCity").val("");
}

//handles forecast search when user clicks a search history button
async function handleSearchHistoryCitySearch(event) {
  event.preventDefault();

  //gets latitude and longitude from clicked search history button
  const searchHistoryBtn = $(event.currentTarget);
  const latitude = searchHistoryBtn.data("latitude");
  const longitude = searchHistoryBtn.data("longitude");

  //forecast call with latitude and longitude from search history button
  let forecast = await handleForecast(latitude, longitude);
  //loads current and 5 day forecast cards
  handleForecardCards(forecast);
}

//creates current and five day forecast cards
function handleForecardCards(forecast) {
  //creates object using current forecast data
  const currentForecastDetails = {
    city: forecast.city.name,
    icon: forecast.list[0].weather[0].icon,
    date: forecast.list[0].dt_txt,
    temperature: Math.round(forecast.list[0].main.temp),
    wind: forecast.list[0].wind.speed,
    humidity: forecast.list[0].main.humidity,
  };

  currentForecastStorage = currentForecastDetails;
  // puts current data into local stoarge
  localStorage.setItem(
    "currentForecast",
    JSON.stringify(currentForecastStorage)
  );

  //creates current forecast card
  loadCurrentForecastCard();

  fiveDayForecastStorage = [];

  //gets five day forecast from forecast response
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
  //adds five day forecast list to local storage
  localStorage.setItem(
    "fiveDayForecast",
    JSON.stringify(fiveDayForecastStorage)
  );
  // creates five day forecast cards from local storage
  loadFiveDayForecastCard();
}

//function renders search history buttons from local storage
function loadSearchHistoryButtons() {
  //empties search history buttons
  $(".history-btns").empty();
  //if there is one or more search history buttons, then renders from local storage
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
  //adds event listener to search history buttons
  $(".search-history").on("click", handleSearchHistoryCitySearch);
}

//function creates current forecast card from local storage
function loadCurrentForecastCard() {
  //if there is something in local storage, will render
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

//function that creates the five day forecast cards
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

//functions run when page loads
$(document).ready(function () {
  loadCurrentForecastCard();
  loadFiveDayForecastCard();
  loadSearchHistoryButtons();
  $("#cityInput").on("submit", handleCitySearch);
  $(".search-history").on("click", handleSearchHistoryCitySearch);
});
