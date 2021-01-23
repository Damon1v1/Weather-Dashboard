// API KEY
// 082d012876efb2cdfc83f4d294eb4ef4
// var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=082d012876efb2cdfc83f4d294eb4ef4"
/*$.ajax({
    url: queryURL,
    method: "GET"})
    .then(function(response) { 
    console.log(response)})*/

$(document).ready(function() {
    $("#search-button").on("click", function() {
      var searchValue = $("#search-value").val();
  
      // clear input box
      $("#search-value").val("");
  
      searchWeather(searchValue);
    });

    // function to add last searched to history list
    $(".history").on("click", "li", function() {
      searchWeather($(this).text());
    });
    
    // function to append other items from history to list element
    function makeRow(text) {
      var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
      $(".history").append(li);
    }

function searchWeather(searchValue){
  $.ajax({
    url:  "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=082d012876efb2cdfc83f4d294eb4ef4",
    method: "GET"}).then(function(response){
      console.log(response);
      $("#today").empty();
      //creating bootstrap elements
      var card = $("<div>").addClass("card");
      var cardBody = $("<div>").addClass("card-body");
      

      //assigning weather icon to dom element
      var cityImg = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");

      // assigning city name and current date to dom element
      var cityHead = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ")");
      
      // assigning city temp to dom element
      var cityP1 = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + " °F");

      // assigning city humidity to dom element
      var cityP2 = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");

      // assigning city wind speed to html element
      var cityP3 = $("<p>").addClass("card-text").text("Wind speed: " + response.wind.speed + " MPH");
      

      cityHead.append(cityImg);
      cardBody.append(cityHead, cityP1, cityP2, cityP3);
      card.append(cardBody);
      $("#today").append(card);

      getForecast(searchValue);
      searchUV(response.coord.lat, response.coord.lon);
    })}


function getForecast(searchValue) {
  $.ajax({
    url:  "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=082d012876efb2cdfc83f4d294eb4ef4",
    method: "GET"}).then(function(response){
      console.log(response);
      // overwrite any existing content with title and empty row
      $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
      // loop over all forecasts (by 3-hour increments)
      for (var i = 0; i < response.list.length; i++) {
      // only look at forecasts around 3:00pm
      if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
        // create html elements for a bootstrap card
        var col = $("<div>").addClass("col-md-2");
        var card = $("<div>").addClass("card bg-primary text-white");
        var body = $("<div>").addClass("card-body p-2");
  
        var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
  
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
  
        var p1 = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp_max + " °F");
        var p2 = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");
  
        // merge together and put on page
        col.append(card.append(body.append(title, img, p1, p2)));
        $("#forecast .row").append(col);
      }
      }
    }
    )};
  

function searchUV(lat, lon){
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=082d012876efb2cdfc83f4d294eb4ef4",
    method: "GET"}).then(function(response) { 
      console.log(response);
      var uv = $("<p>").text("UV Index: ");
      var btn = $("<span>").addClass("btn btn-sm").text(response.value);
        
      // checks uv index and assigns color value
      if (response.value < 3) {
        btn.addClass("btn-success");
      }
      else if (response.value < 7) {
        btn.addClass("btn-warning");
      }
      else {
        btn.addClass("btn-danger");
      }
      // appends uv index to to "today" dom element on index
      $("#today .card-body").append(uv.append(btn));
  })
}


var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }

})




