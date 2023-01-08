//  Global variables

// Add your own API key between the ""
var ApiKey = "166a433c57516f51dfab1f7edaed8413";
// Here we are building the URL we need to query the database
// Need to pass in coordinates instead of just a city name
var coordinatesUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";
const weatherIconUrl = "http://openweathermap.org/img/wn/";

//Add for searching city
var searchCity = $("#search-city");
var cityInputEl = $("#city");

//Add for creating history
var searchHistoryEl = $("#search-history");
var searchHistoryArray = loadSearchHistory();

//Add for results of Weather Dashboard
var col2El = $(".col2");
var fiveDayEl = $("#five-day");

//Date format
var currentDay = moment().format("DD/M/YYYY");


// Add function to capitalize the first letter of a string
function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
}

//Add search history to page
function loadSearchHistory() {
    var searchHistoryArray = JSON.parse(localStorage.getItem("search history"));
    if (!searchHistoryArray) {
        searchHistoryArray = {
            searchedCity: [],
        };
    } else {
        for (var i = 0; i < searchHistoryArray.searchedCity.length; i++) {
            searchHistory(searchHistoryArray.searchedCity[i]);
        }
    }
    return searchHistoryArray;
}

//The local storage
function saveSearchHistory() {
    localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
};

//Create buttons for searched cities
function searchHistory(city) {
    var renderHistoryBtn = $("<button>")
        .addClass("btn")
        .text(city)
        .on("click", function () {
            $("#current-weather").remove();
            $("#five-day").empty();
            $("#five-day-header").remove();
            getWeather(city);
        })
        .attr({
            type: "button"
        });
    searchHistoryEl.append(renderHistoryBtn);
}

//To get weather data from apiUrl
function getWeather(city) {
    var apiCoordinatesUrl = coordinatesUrl + city + "&appid=" + ApiKey;
    // Fetch the coordinates for parameter city
    fetch(apiCoordinatesUrl)
    .then(function (coordinateResponse) {
        if (coordinateResponse.ok) {
        coordinateResponse.json().then(function (data) {
        //variables for each coordinate    
        var cityLatitude = data.coord.lat;
        var cityLongitude = data.coord.lon;
        var apiQueryUrl = queryUrl + cityLatitude + "&lon=" + cityLongitude + "&appid=" + ApiKey + "&units=imperial";

        fetch(apiQueryUrl)
        .then(function (weatherResponse) {
            if (weatherResponse.ok) {
            weatherResponse.json().then(function (weatherData) {

                                    
//Results for Current day
var currentWeatherEl = $("<div>")
.attr({
    id: "current-weather"
})

// variables for adding the weather icon
var weatherIcon = weatherData.current.weather[0].icon;
var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + ".png";

// Create h2 to display city, (current day "DD/M/YYYY"), current weather icon
var currentWeatherHeadingEl = $("<h2>")
.text(city + "(" + currentDay + ")");
// Weather icon
var iconImgEl = $('<img>')
.attr({
    id: "current-weather-icon",
    src: cityCurrentWeatherIcon,
    alt: "Weather Icon"
})
//The list of current weather details
var currWeatherListEl = $("<ul>")

// Create CODE HERE to calculate the temperature (converted from Fahrenheit)
var tempC = Math.round((weatherData.current.temp - 32)/1.8);
// Temperature measured in Celsius, wind speed in Miles Per Hour, humidity in percent
var currWeatherDetails = ["Temp: " + tempC + " °C", "Wind: " + weatherData.current.wind_speed + " MPH", "Humidity: " + weatherData.current.humidity + "%"]
for (var i = 0; i < currWeatherDetails.length; i++) {
    var currWeatherListItem = $("<li>")
    .text(currWeatherDetails[i])
    currWeatherListEl.append(currWeatherListItem);
}

// Append all before 5-Day Forecast in the specified order
$("#five-day").before(currentWeatherEl);
currentWeatherEl.append(currentWeatherHeadingEl);
currentWeatherHeadingEl.append(iconImgEl);
currentWeatherEl.append(currWeatherListEl);

                             

// Results for 5-Day Forecast (created in a same way as current day)
var fiveDayHeaderEl = $("<h2>")
.text("5-Day Forecast:")
.attr({
    id: "five-day-header"
})

$('#current-weather').after(fiveDayHeaderEl)
// Add array using "for" loop
var fiveDayArray = [];
for (var i = 0; i < 5; i++) {
    var forecastDate = moment().add(i + 1, "days").format("DD/M/YYYY");
    fiveDayArray.push(forecastDate);
}

for (var i = 0; i < fiveDayArray.length; i++) {
    var cardDivEl = $("<div>")
    .addClass("col3");

    var cardBodyDivEl = $("<div>")
    .addClass("card-body");

    var cardTitleEl = $("<h3>")
    .addClass("card-title")
    .text(fiveDayArray[i]);

    //Icon for each day                                    
    var forecastIcon = weatherData.daily[i].weather[0].icon;
    var forecastIconEl = $("<img>")
    .attr({
        src: weatherIconUrl + forecastIcon + ".png",
        alt: "Weather Icon"
    });

    // Create CODE HERE to calculate the temperature (converted from Fahrenheit) and use static method Math.round
    var tempC = Math.round((weatherData.current.temp - 32)/1.8);
    var currWeatherDetails = ["Temp: " + tempC + " °C", "Wind: " + weatherData.current.wind_speed + " MPH", "Humidity: " + weatherData.current.humidity + "%"]
    //The list of all weather conditions                                   
    var tempEL = $("<p>")
    .addClass("card-text")
    .text('Temp: ' + Math.round((weatherData.daily[i].temp.max - 32)/1.8) + " °C")
                                        
    var windEL = $("<p>")
    .addClass("card-text")
    .text("Wind: " + weatherData.daily[i].wind_speed + " MPH")
                                        
    var humidityEL = $("<p>")
    .addClass("card-text")
    .text("Humidity: " + weatherData.daily[i].humidity + "%")


    //Append all after Current Day in the specified order
    fiveDayEl.append(cardDivEl);
    cardDivEl.append(cardBodyDivEl);
    cardBodyDivEl.append(cardTitleEl);
    cardBodyDivEl.append(forecastIconEl);
    cardBodyDivEl.append(tempEL);
    cardBodyDivEl.append(windEL);
    cardBodyDivEl.append(humidityEL);
    }

                                    
            })
        }
    })
 });
            // If it is imposible find written city in Open Weather 
            } else {
                alert("City not found, try entering the closest one")
            }
        })
        // If fetch fails
        .catch(function (error) {
            alert("Unable to connect to Open Weather");
        });
}

//Main Function handles events where one button is clicked, which includes all previous

function submitCitySearch(event) {
    event.preventDefault();
    var city = titleCase(cityInputEl.val().trim());
    //If city already has button
    if (searchHistoryArray.searchedCity.includes(city)) {
        alert(city + " is included in history below. Click the " + city + " button to get weather.");
        cityInputEl.val("");
    } else if (city) {
        //To get weather data from apiUrl
        getWeather(city);
        //For searched cities
        searchHistory(city);
        searchHistoryArray.searchedCity.push(city);
        //The local storage
        saveSearchHistory();
        
        cityInputEl.val("");
        
        //If you didn't type in a city
    } else {
        alert("Please enter a city for getting weather condition");
    }
}

// Activate process getting city data from user and weather data to user
searchCity.on("submit", submitCitySearch);

$("#search-btn").on("click", function () {
    $("#current-weather").remove();
    $("#five-day").empty();
    $("#five-day-header").remove();
})