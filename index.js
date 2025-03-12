const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});




const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function fetchWeather(city) {
  const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const weatherData = JSON.parse(data);
        if (weatherData.cod === 200) {
          displayWeather(weatherData);
        } else {
          console.log(`Error: ${weatherData.message}`);
        }
      } catch (error) {
        console.error('Error parsing weather data:', error);
      }
      promptUser();
    });
  }).on('error', (err) => {
    console.error('Error fetching weather data:', err.message);
    promptUser();
  });
}

function displayWeather(data) {
  console.log('\nCurrent Weather:');
  console.log(`City: ${data.name}, ${data.sys.country}`);
  console.log(`Temperature: ${data.main.temp}°C`);
  console.log(`Weather: ${data.weather[0].description}`);
  console.log(`Humidity: ${data.main.humidity}%`);
  console.log(`Wind Speed: ${data.wind.speed} m/s`);
}

function showMenu() {
  console.log('\n1. Get Weather');
  console.log('2. Exit');
}

function handleUserInput(input) {
  const command = input.trim();

  if (command === '1') {
    rl.question('Enter city name: ', (city) => {
      if (city) {
        fetchWeather(city);
      } else {
        console.log('City name cannot be empty.');
        promptUser();
      }
    });
  } else if (command === '2') {
    console.log('Goodbye!');
    rl.close();
  } else {
    console.log('Invalid choice. Please try again.');
    promptUser();
  }
}

function promptUser() {
  showMenu();
  rl.question('Choose an option: ', handleUserInput);
}

console.log('=== Weather CLI App ===');
promptUser();
