// retrieve user input for city
// store searched cities as buttons
// get lat and longitue from api call using city from user input
// use latitute and longitute to get weather forcast
// display the forcast back onto index.html
//

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
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      foreCast = data;
    });
  //returns forcast JSON
  return foreCast;
}

async function handleCitySearch(event) {
  event.preventDefault();

  const city = $("#inputCity").val();
  console.log(city);

  //make API call to get forcast using lat and long
  let coordinates = await handleCoordinates(city);
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  let forecast = await handleForecast(latitude, longitude);
  console.log(forecast);

  //get information for single day forcast

  //create card with single day forcast information
  //get information for 5 day forcast
  //create cards for 5 day forcast
  //append cards to index.html
}

$(document).ready(function () {
  $("#cityInput").on("submit", handleCitySearch);
});
