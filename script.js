// Variables
let queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
let fiveDayUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='
let apikey = '&appid=0cf78313188ed7c923c873cd418f1e41';
let prevSearchArray = JSON.parse(localStorage.getItem("recentSearchArray")) || [];
let recentSearch = JSON.parse(localStorage.getItem("mostRecentSearch"));
let prevSearchBtns = $(".recentSearch");

// AJAX Weather API Fuction
function currentWeather(current) {
    $.ajax({
        url: current,
        method: "GET"
    }).then(function (response) {
        console.log("Current Weather: ")
        console.log(response);
        $("#mainIcon").attr('src', `https://openweathermap.org/img/w/${response.weather[0].icon}.png`)
        $("#mainIcon").attr('alt', `${response.weather[0].description}`)
        $("#currentTemp").text("Temperature: " + Math.round(response.main.temp) + " F");
        $("#currentHumid").text("Humidity: " + response.main.humidity + "%");
        $("#currentWind").text("Wind Speed: " + response.wind.speed + "MPH");

        let queryUrlUv = `https://api.openweathermap.org/data/2.5/uvi/forecast?` + `appid=0cf78313188ed7c923c873cd418f1e41` + `&lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=1`
        $.ajax({
            url: queryUrlUv,
            method: "GET"
        }).then(function (responseUv) {
            $("#currentUv").text("UV index: " + responseUv[0].value)
        })
    })
};

// Empty Cards Function
function emptyCards() {
    for (let i = 0; i < 5; i++) {
        $("#card" + i).empty();
    }
}

// Search List Function 
function recentSearchList() {
    $.each(prevSearchArray, function (index, object) {
        let SearchBtn = $('<li class=".recentSearch">');
        SearchBtn.text(object.city);
        prevSearchBtns.append(SearchBtn);
    })
}

// AJAX 5 Day API Function
function fiveDayWeather(fiveDay) {
    emptyCards();
    $.ajax({
        url: fiveDay,
        method: "GET"
    }).then(function (responseFiveDay) {
        console.log("Five Day Forecast: ")
        console.log(responseFiveDay);
        $("#currentWeatherCity").text(responseFiveDay.city.name);
        let j = 0;
        for (let i = 0; i < 39; i += 8) {

            let forecastBody = $(`<div class="card-body${j}"></div>`);
            let forecastIcon = $(`<img src="" alt="">`);
            let forecastTemp = $(`<p class="card-text"></p>`);
            let forecastHumid = $(`<p class="card-text"></p>`);

            forecastIcon.attr('src', `https://openweathermap.org/img/w/${responseFiveDay.list[i].weather[0].icon}.png`);
            forecastTemp.text('Temperature: ' + responseFiveDay.list[i].main.temp + ' F');
            forecastHumid.text('Humidity: ' + responseFiveDay.list[i].main.humidity + '%');
            $("#card" + j).append(forecastBody);
            $(".card-body" + j).append(forecastIcon);
            $(".card-body" + j).append(forecastTemp);
            $(".card-body" + j).append(forecastHumid);

            j++;
        }
    })
};

// Current Date Function
function newDates() {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();

    $("#todaysDate").text(output);
    for (let i = 0; i < 5; i++) {
        day++;
        output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();
        $(".date" + i).text(output);
    }
}

newDates();

// Search Button
$(".btn").on("click", function (event) {
    event.preventDefault();
    let city = $('#citySearched').val().trim();
    console.log(city);
    let currentWeatherUrl = queryUrl + city + "&units=imperial" + apikey;
    currentWeather(currentWeatherUrl);
    let fiveDayWeatherUrl = fiveDayUrl + city + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);

    let citiesJSON = {
        city: city
    }

    let searchBtn = $('<li class=".recentSearch">');
    searchBtn.text(city);
    prevSearchBtns.append(searchBtn);

    prevSearchArray.push(citiesJSON);
    localStorage.setItem('recentSearchArray', JSON.stringify(prevSearchArray));
    localStorage.setItem('mostRecentSearch', JSON.stringify(city));
})

// Recently Searched Cities Button & Storage
prevSearchBtns.on("click", function (e) {
    event.preventDefault();
    clickedRecent = $(e.target).text();
    console.log(clickedRecent);
    $('#citySearched').val('');

    let currentWeatherUrl = queryUrl + clickedRecent + "&units=imperial" + apikey;
    currentWeather(currentWeatherUrl);

    let fiveDayWeatherUrl = fiveDayUrl + clickedRecent + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);
    localStorage.setItem('mostRecentSearch', JSON.stringify(clickedRecent))

})


recentSearchList();
