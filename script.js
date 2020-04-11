let queryUrlBase = 'https://api.openweathermap.org/data/2.5/weather?q=';
let fiveDayUrlBase = 'https://api.openweathermap.org/data/2.5/forecast?q='
let apikey = '&appid=0cf78313188ed7c923c873cd418f1e41';

let recentSearchArray = JSON.parse(localStorage.getItem("recentSearchArray")) || [];
let mostRecentSearch = JSON.parse(localStorage.getItem("mostRecentSearch"));
let recentSearchBtns = $(".recentSearch");

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
function emptyCards() {
    for (let i = 0; i < 5; i++) {
        $("#card" + i).empty();
    }
}
function renderSearchedCities() {
    $.each(recentSearchArray, function (index, object) {
        let newSearchBtn = $('<li class=".recentSearch">');
        newSearchBtn.text(object.city);
        recentSearchBtns.append(newSearchBtn);
    })
}
function fiveDayWeather(fiveDay) {
    emptyCards();
    $.ajax({
        url: fiveDay,
        method: "GET"
    }).then(function (responseFive) {
        console.log("Five Day Forecast: ")
        console.log(responseFive);
        $("#currentWeatherCity").text(responseFive.city.name);
        let j = 0;
        for (let i = 0; i < 39; i += 8) {

            let forecastNewBody = $(`<div class="card-body${j}"></div>`);
            let forecastNewIcon = $(`<img src="" alt="">`);
            let forecastNewTemp = $(`<p class="card-text"></p>`);
            let forecastNewHumid = $(`<p class="card-text"></p>`);

            forecastNewIcon.attr('src', `https://openweathermap.org/img/w/${responseFive.list[i].weather[0].icon}.png`);
            forecastNewTemp.text('Temperature: ' + responseFive.list[i].main.temp + ' F');
            forecastNewHumid.text('Humidity: ' + responseFive.list[i].main.humidity + '%');
            $("#card" + j).append(forecastNewBody);
            $(".card-body" + j).append(forecastNewIcon);
            $(".card-body" + j).append(forecastNewTemp);
            $(".card-body" + j).append(forecastNewHumid);

            j++;
        }
    })
};

function setDates() {
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

setDates();

$(".btn").on("click", function (event) {
    event.preventDefault();
    let city = $('#citySearched').val().trim();
    console.log(city);
    let currentWeatherUrl = queryUrlBase + city + "&units=imperial" + apikey;
    currentWeather(currentWeatherUrl);
    let fiveDayWeatherUrl = fiveDayUrlBase + city + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);

    let cityJSON = {
        city: city
    }

    let newSearchBtn = $('<li class=".recentSearch">');
    newSearchBtn.text(city);
    recentSearchBtns.append(newSearchBtn);

    recentSearchArray.push(cityJSON);
    localStorage.setItem('recentSearchArray', JSON.stringify(recentSearchArray));
    localStorage.setItem('mostRecentSearch', JSON.stringify(city));
})

recentSearchBtns.on("click", function (e) {
    event.preventDefault();
    clickedRecent = $(e.target).text();
    console.log(clickedRecent);
    $('#citySearched').val('');

    let currentWeatherUrl = queryUrlBase + clickedRecent + "&units=imperial" + apikey;
    currentWeather(currentWeatherUrl);

    let fiveDayWeatherUrl = fiveDayUrlBase + clickedRecent + "&units=imperial" + apikey;
    fiveDayWeather(fiveDayWeatherUrl);
    localStorage.setItem('mostRecentSearch', JSON.stringify(clickedRecent))

})

renderSearchedCities();
