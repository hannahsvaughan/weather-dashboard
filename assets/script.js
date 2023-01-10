const APIKey = "25ee199cf6b912ff000a1bab44ef907b";
var cities = [];
cities.reverse();

function loadFromStorage(){
    cities = JSON.parse(localStorage.getItem("cities")) || [];
    //from the storage, render the buttons
}

function saveToStorage() {
    localStorage.setItem("cities", JSON.stringify(cities));
    citiesDisplay();
}

$(document).ready(function () {
    loadFromStorage();
    console.log("document ready")
    console.log(cities)
    if (cities[0]) {
        getCity(cities[cities.length - 1]);
    }
    citiesDisplay();

    $(".btn").on("click", function (event) {
        event.preventDefault();
        var input = $(".form-control");
        var city = input.val();
        if(!city){
            return
        }
        if (!cities.includes(city)) {
            cities.push(city);
            saveToStorage();
        }
        getCity(city);
    });
});


//get city weather info
function getCity(city) {
    var currentDate = moment().format("LL");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;


// get API data with Ajax
    $.ajax({ url: queryURL, type: "GET"}).then(function(response) {
        console.log(response);

        var iconLoc = response.weather[0].icon;
        var iconSrc = "https://openweathermap.org/img/wn/" + iconLoc + "@2x.png";
        var iconImage = $("<img>");
        iconImage.attr("src", iconSrc);

        $(".current-city").text(response.name + " (" + currentDate + ")");
        $(".current-city").append(iconImage);
        $("#temp").text("Temperature: " + response.main.temp + " F");
        $("#hum").text("Humidity: " + response.main.humidity + " %");
        $("#wind").text("Wind Speed: " + response.wind.speed + " MPH");

        // convert temp
        var tempFahr = (response.main.temp - 273.15) * 1.8 + 32;
        $(".tempFahr").text("Temperature (Kelvin) " + tempFahr);
        forecast(city);
        });
}

//display cities
function citiesDisplay() {
    var limit;

    //limit display of cities to 10
    if (cities.length < 10) {
        limit = cities.length;
    } else {
        limit = 10;
    }

    $("#cityView").html("");
    for (var i = 0; i < limit; i++) {
        var cityView = $("<div>");
        cityView.css({
            textAlign: "center",
            border: "1px solid white",
            height: "50px",
            lineHeight: "50px",
        });
        cityView.html(cities[i]);
        $("#cityView").prepend(cityView);

        cityView.attr("id", `${cities[i]}`);
        $(`#${cities[i]}`).on("click", function () {
            getCity($(this).text());
        });
    }
}

//5 day forecast 
function forecast(city) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    $.ajax({ url: forecastURL, type: "GET"}).then(function (response) {
        var list = response.list;

        $("#forecast").html("");
        for (var i = 39; i >= 0; i = i - 8) {
            var temp = ((list[i].main.temp - 273.15) * 1.8 + 32).toFixed(2);
            var iconID = list[i].weather[0].icon;
            var humidity = list[i].main.humidity;
            var date = new Date(list[i].dt_txt);

            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();

            var newDate = `${month + 1}/${day}/${year}`;

            //creating and storing a div tag
            var col = $("<div>");
            col.addClass("col");
            var myCard = $("<div>");
            myCard.addClass("card");
            col.append(myCard);

            // creating a p tag with response item
            var p = $("<p>").text(newDate);

            // creating and storing an image tag
            var iconURL = "https://openweathermap.org/img/w/" + iconID + ".png";

            var weatherImage = $("<img>");
            weatherImage.attr("src", iconURL);

            var p1 = $("<p>").text("Temp: " + temp + "F");
            var p2 = $("<p>").text("Humidity: " + humidity + "%");


            // appending the paragraph and image tags to myCard  
            myCard.append(p);
            myCard.append(weatherImage);
            myCard.append(p1);
            myCard.append(p2);

            $("#forecast").prepend(col);
        }
    });
}