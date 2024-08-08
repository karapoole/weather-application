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

  createForecastCard(forecast);
}

// TODO function to create current forecast card
function createForecastCard(forecastData) {
  const cardBody = $("<div>");
  //creates box around forecast card
  cardBody.css("border", "3px solid black");
  cardBody.css("border-width", "5px");
  cardBody.css("marginTop", "10px");
  cardBody.css("padding", "30px");

  // creates paragraph element in card, adds class for card city, creates text for city
  const cardCity = $("<h3>");
  cardCity.addClass("card-city");
  cardCity.text(forecastData.city.name);

  // creates paragraph element in card, adds class for card date, creates text for date
  const cardDate = $("<h5>");
  cardDate.addClass("card-date");
  cardDate.text(forecastData.list[0].dt_txt);

  // creates paragraph element in card, adds class for card temperature, creates text for temperature
  const cardTemperature = $("<p>");
  cardTemperature.addClass("card-temperature");
  cardTemperature.text(forecastData.list[0].main.temp);
  //math.round() Math.floor(number here); <- this rounds it DOWN so 4.6 becomes 4
  // math.round(number here); <- this rounds it UP so 4.6 becomes 5

  // creates paragraph element in card, adds class for card emoji, creates text for emoji
  const cardEmoji = $("<p>");
  cardEmoji.addClass("card-emoji");
  //ADD CONDITIONAL STATEMENT FOR EMOJI --- IS THIS NEEDED???
  cardEmoji.text(forecastData.list[0].weather[0].icon);

  // creates paragraph element in card, adds class for card wind, creates text for wind
  const cardWind = $("<p>");
  cardWind.addClass("card-wind");
  cardWind.text(forecastData.list[0].wind.speed);

  // creates paragraph element in card, adds class for card humidity, creates text for humidity
  const cardHumidity = $("<p>");
  cardHumidity.addClass("card-humidity");
  cardHumidity.text(forecastData.list[0].main.humidity);

  // appends card title, card text, card deadline, card delete button, and card body
  cardBody.append(cardCity);
  cardBody.append(cardDate);
  cardBody.append(cardTemperature);
  cardBody.append(cardEmoji);
  cardBody.append(cardWind);
  cardBody.append(cardHumidity);
  $(".forecast-card").append(cardBody);

  //   return cardBody;
}

// function weatherEmoji(weatherIcon) {
//   switch (weatherIcon) {
//     case "clear sky":
//       "☀️";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     case "few clouds":
//       "⛅";
//       break;
//     default:
//     // code block
//   }
// }

// TODO function to create five day forecast cards

// TODO function to create Search History button

// TODO function to write things to local storage

// TODO function to render things from localStorage

$(document).ready(function () {
  $("#cityInput").on("submit", handleCitySearch);
});
