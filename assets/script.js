var userFormEl = document.querySelector('#user-form');
var cityEl = document.querySelector('#city');
var stateEl = document.querySelector('#state');
var zipEl = document.querySelector('#zip');
var forecast = document.querySelector('#forecast')
var hero = document.querySelector('#hero')
var searchHistory = [];
// handles the submission of the form
var formSubmitHandler = function (event) {
    event.preventDefault();
    //get the input from the form
    var city = cityEl.value.trim()
    var state = stateEl.value.trim()
    var zip = zipEl.value.trim()

    //creates and stores an object for search history
    searchHistory.push({city: city, state: state, zip: zip});
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displaySearchHistory()

    //fetches the api
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+","+state+","+zip+"&appid=8ab1ad8907d5b53ce4b2492d5b880ab1"
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            console.log(data)
            renderWeather(data)
          });
        
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
  };
//generates the forecast on the screen
var renderWeather  = function(data){
    //resets before populating
    forecast.innerHTML = '';
    hero.innerHTML = '';
    //creates the current weather header with city name
    var cityName = document.createElement('h2');
    cityName.textContent = data.city.name;
    hero.appendChild(cityName);

    var temp = document.createElement("p")
    temp.textContent ="Temp: " + Number(1.8 * (data.list[0].main.temp - 273) + 32).toFixed(1) + " °F"
    hero.appendChild(temp)

    var wind = document.createElement("p")
    wind.textContent ="Wind: " + data.list[0].wind.speed +"mph"
    hero.appendChild(wind)

    var humidity = document.createElement("p")
    humidity.textContent ="Humidity: " + data.list[0].main.humidity
    hero.appendChild(humidity)
    // creates 5 weather cards for the next five days
    for(i=0; i<40; i= i+8){
        var container = document.createElement("div")
        container.id = "weatherCard"

        var date = document.createElement("p")
        date.textContent = data.list[i].dt_txt
        container.appendChild(date)

        var temp = document.createElement("p")
        temp.textContent ="Temp: " + Number(1.8 * (data.list[i].main.temp - 273) + 32).toFixed(1) + " °F"
        container.appendChild(temp)

        var wind = document.createElement("p")
        wind.textContent ="Wind: " + data.list[i].wind.speed +"mph"
        container.appendChild(wind)

        var humidity = document.createElement("p")
        humidity.textContent ="Humidity: " + data.list[i].main.humidity
        container.appendChild(humidity)

        forecast.appendChild(container)

       
    }
}
//retrieves search history from local storage and renders it on screen
var displaySearchHistory = function() {
    var historyList = document.querySelector('#history-list');
    historyList.innerHTML = ""
    savedHistory = JSON.parse(localStorage.getItem('searchHistory'))
    //makes sure history is max 5
    if (savedHistory.length > 5) {
        savedHistory = savedHistory.slice(0, 5);
    }
    savedHistory.forEach(function(history) {
        var historyItem = document.createElement("li");
        historyItem.textContent = history.city + ', ' + history.state;
        // renders city data on click from history
        historyItem.addEventListener('click', function() {
            cityEl.value = history.city;
            stateEl.value = history.state;
            zipEl.value = history.zip
            var city = cityEl.value.trim()
            var state = stateEl.value.trim()
            var zip = zipEl.value.trim()
            var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+","+state+","+zip+"&appid=8ab1ad8907d5b53ce4b2492d5b880ab1"
            fetch(apiUrl)
                .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                    console.log(data)
                    renderWeather(data)
                });
        
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to GitHub');
    });
        });
        historyList.appendChild(historyItem);
    });
};

userFormEl.addEventListener('submit', formSubmitHandler);
displaySearchHistory()

