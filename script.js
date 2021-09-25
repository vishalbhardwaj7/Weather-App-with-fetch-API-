//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*//
//--------------------------------------  Please use your own API keys ------------------------------------//
//-------------------------------------- Images from unsplash.com ------------------------------------//
//-------------------------------------- Weather from api.openweathermap.org --------------------------//
//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*//

// Generate Instances
const imagesKey = "P_es7sofbtrEGbWGF6VowVhR9gikgJg9pOPQN7k9AXA";
const key = "4ff134f5c20eed9bcbd143fb6672c58e";
const input = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const currBtn = document.getElementById("currLocBtn");
const cityName = document.getElementById("cityName");
const time = document.getElementById("time");
const temp = document.getElementById("temp");
const weather = document.getElementById("weather");
const image = document.getElementById("image");
let latitude, longitude, date, time1;

// Get location from user

function getLocation(e) {
  e.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Not supported");
  }
}
// Update position by getting location from geolocation API

function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  date = new Date(position.timestamp);
  time1 = date.toLocaleTimeString();
  //   Call the update webpage info function with parameters
  updateWebpage(latitude, longitude, time1, "", "auto");
}

// Adding event listener to the currentLocationButton

currBtn.addEventListener("click", getLocation);

// Adding event listener to manual search button

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchKey = input.value;
  updateWebpage("", "", "", searchKey, "manual");
});

// get image from unsplash

let imgSrc = "";
function fetchImage(query) {
  fetch(
    `https://api.unsplash.com/search/photos/?query=${query}&client_id=${imagesKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      imgSrc = data.results[getRandom()].urls.thumb;
      image.setAttribute("src", imgSrc);
    });
}

// api call to update the webpage
//if type auto search by latitude and longitutde
// if type manual search by input value

function updateWebpage(lat, lon, time1, searchKey, type) {
  let api;
  if (type == "auto") {
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.toFixed(
      2
    )}&lon=${lon.toFixed(2)}&appid=${key}`;
  } else {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${searchKey}&appid=${key}
`;
    function setTime(data) {
      // get time in case of manual city by conversion
      let tempTime = new Date();
      let hours = tempTime.getUTCHours();
      let seconds = tempTime.getUTCSeconds();
      let minutes = tempTime.getUTCMinutes();
      tempTime.setHours(hours);
      tempTime.setSeconds(seconds);
      tempTime.setMinutes(minutes);
      tempTime.setUTCSeconds(data.timezone);
      time.innerText = tempTime.toLocaleTimeString();
    }
  }
  fetch(api, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      weather.innerText = data.weather[0].main;
      fetchImage(data.weather[0].description);
      if (type == "manual") {
        setTime(data);
      } else {
        time.innerText = time1;
      }

      cityName.innerText = data.name;
      temp.innerText = (data.main.temp - 273.15).toFixed(2) + " \u00B0C"; // degree sign
    });
}

//utility function for random number

function getRandom() {
  return Math.floor(Math.random() * 10);
}
