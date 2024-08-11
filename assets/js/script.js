//function to get an return latitue and longitue of city
async function handleCoordinates(city) {
  let latlon = [];
  const apiKey = "";
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
  clearForecastDetails();

  const city = $("#inputCity").val();

  let coordinates = await handleCoordinates(city);
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  //passes latitdue and longitude to get forecast data
  let forecast = await handleForecast(latitude, longitude);

  // console.log(forecast);
  loadForecastCards(forecast);
}

// function to load forecast results from search history buttons
function handleSearchHistory() {}

// function to clear the contents of current and five day forecast
function clearForecastDetails() {
  $(".forecast-card").empty();
  $(".five-day").empty();
}
// Function to create Current Forecard card
function loadForecastCards(forecastData) {
  const currentForecastDetails = {
    city: forecastData.city.name,
    icon: weatherEmoji(forecastData.list[0].weather[0].icon),
    date: forecastData.list[0].dt_txt,
    temperature: Math.round(forecastData.list[0].main.temp),
    wind: forecastData.list[0].wind.speed,
    humidity: forecastData.list[0].main.humidity,
  };
  loadCurrentForecastCard(currentForecastDetails);
  // fiveDayForecastList = [];
  for (let i = 7; i < forecastData.list.length; i += 8) {
    const fiveDayForecastDetail = {
      icon: weatherEmoji(forecastData.list[i].weather[0].icon),
      date: forecastData.list[i].dt_txt,
      temperature: Math.round(forecastData.list[i].main.temp),
      wind: forecastData.list[i].wind.speed,
      humidity: forecastData.list[i].main.humidity,
    };
    loadFiveDayForecastCard(fiveDayForecastDetail);
  }
  // console.log(fiveDayForecastList);
  const historyBtn = $("<button>");
  historyBtn.text(forecastData.city.name);
  // add data-* attribute for city name
  $(".history-btns").append(historyBtn);
}

function loadCurrentForecastCard(currectForecastDetails) {
  //creates box around forecast card
  const cardBody = $("<div>");
  cardBody.css("border", "3px solid black");
  cardBody.css("border-width", "5px");
  cardBody.css("marginTop", "10px");
  cardBody.css("padding", "30px");

  // creates paragraph element in card, adds class for card city, creates text for city
  const cardCity = $("<h3>");
  cardCity.addClass("card-city");
  cardCity.text(
    currectForecastDetails.city + " " + currectForecastDetails.icon
  );

  // creates paragraph element in card, adds class for card date, creates text for date
  const cardDate = $("<h5>");
  cardDate.addClass("card-date");
  let date = currectForecastDetails.date.split(" ");
  cardDate.text(dayjs(date[0]).format("MM/DD/YYYY"));

  // creates paragraph element in card, adds class for card temperature, creates text for temperature
  const cardTemperature = $("<p>");
  cardTemperature.addClass("card-temperature");
  cardTemperature.text(
    "Temperature: " + currectForecastDetails.temperature + "\u00B0"
  );

  // creates paragraph element in card, adds class for card emoji, creates text for emoji
  const cardEmoji = $("<h2>");
  cardEmoji.addClass("card-emoji");
  cardEmoji.text();

  // creates paragraph element in card, adds class for card wind, creates text for wind
  const cardWind = $("<p>");
  cardWind.addClass("card-wind");
  cardWind.text("Wind Speed: " + currectForecastDetails.wind + " mph");

  // creates paragraph element in card, adds class for card humidity, creates text for humidity
  const cardHumidity = $("<p>");
  cardHumidity.addClass("card-humidity");
  cardHumidity.text("Humidity: " + currectForecastDetails.humidity + "%");

  // appends card title, card text, card deadline, card delete button, and card body
  cardBody.append(cardCity);
  cardBody.append(cardDate);
  cardBody.append(cardEmoji);
  cardBody.append(cardTemperature);
  cardBody.append(cardWind);
  cardBody.append(cardHumidity);
  $(".forecast-card").append(cardBody);
}

// TODO function to create current forecast card
function loadFiveDayForecastCard(fiveDayForecastDetail) {
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
  let date = fiveDayForecastDetail.date.split(" ");
  cardDate.text(dayjs(date[0]).format("MM/DD/YYYY"));

  // creates paragraph element in card, adds class for card emoji, creates text for emoji
  const cardEmoji = $("<h2>");
  cardEmoji.addClass("card-emoji");
  cardEmoji.text(fiveDayForecastDetail.icon);

  // creates paragraph element in card, adds class for card temperature, creates text for temperature
  const cardTemperature = $("<p>");
  cardTemperature.addClass("card-temperature");
  cardTemperature.text(
    "Temperature: " + fiveDayForecastDetail.temperature + "\u00B0"
  );

  // creates paragraph element in card, adds class for card wind, creates text for wind
  const cardWind = $("<p>");
  cardWind.addClass("card-wind");
  cardWind.text("Wind Speed: " + fiveDayForecastDetail.wind + " mph");

  // creates paragraph element in card, adds class for card humidity, creates text for humidity
  const cardHumidity = $("<p>");
  cardHumidity.addClass("card-humidity");
  cardHumidity.text("Humidity: " + fiveDayForecastDetail.humidity + "%");

  // appends card title, card text, card deadline, card delete button, and card body
  cardBody.append(cardDate);
  cardBody.append(cardEmoji);
  cardBody.append(cardTemperature);
  cardBody.append(cardWind);
  cardBody.append(cardHumidity);
  $(".five-day").append(cardBody);
}

function weatherEmoji(weatherIcon) {
  let emojiString = "";
  switch (weatherIcon) {
    case "01d":
      emojiString = "☀️";
      break;
    case "02d":
      emojiString = "⛅";
      break;
    case "03d":
      emojiString = "☁️";
      break;
    case "04d":
      emojiString = "🌤️";
      break;
    case "09d":
      emojiString = "☔";
      break;
    case "10d":
      emojiString = "🌧️";
      break;
    case "11d":
      emojiString = "⛈️";
      break;
    case "13d":
      emojiString = "❄️";
      break;
    case "50d":
      emojiString = "🌫️";
      break;
    default:
      emojiString = "🌘";
  }
  return emojiString;
}

// TODO function to create five day forecast cards

// TODO function to create Search History button

// TODO function to write things to local storage

// TODO function to render things from localStorage

$(document).ready(function () {
  $("#cityInput").on("submit", handleCitySearch);
});
