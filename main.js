// api voor mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vc2llMTIiLCJhIjoiY2s5Mms0NmJ0MDJhaDNxbXZjaWtoejRvYyJ9.HDqPlXesr3XSrA1AAtYcsQ';

// api voor openWeatherMap
let openWeatherMapApiKey = '551b6c3533dace025e6e2c5bc974a52f';

// kaart
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [5.508852, 52.142480],
  zoom: 7
});

// zoekbalk
let geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: 'country'
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


let input = document.getElementById('search');

// event aan zoekbalk
input.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    let country = input.value.trim();
    geocoder.query(country);
    setDetails(country);
    setWeather(country);
  }
});

// details land
function setDetails(country){
  let url = 'https://restcountries.eu/rest/v2/name/' + country + '?fields=name;capital;population;languages;currencies';
  fetch(url)
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let country = document.getElementById('country');
        let capital = document.getElementById('capital');
        let population = document.getElementById('population');
        let language = document.getElementById('language');
        let currency = document.getElementById('currency');

        country.innerText = data[0]['name'];
        capital.innerText = data[0]['capital'];
        population.innerText = numberWithCommas(data[0]['population']);
        language.innerText = data[0]['languages'][0]['name'];
        currency.innerText = data[0]['currencies'][0]['name'];

      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
}

// weer aanpassen : temperatuur + icon
function setWeather(country) {
  let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + country + '&appid=' + openWeatherMapApiKey + '&units=metric';
  fetch(url)
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let responseData = data;
        let c = '°C';
        let temp = document.getElementById('temp');
        let icon = document.getElementById('icon');

        temp.innerText = responseData.main.temp + c;
        icon.src = 'http://openweathermap.org/img/w/' + responseData.weather[0].icon + '.png';

      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
}
