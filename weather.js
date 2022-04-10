/**
 * A simpler solution with:
 * - no comprehensive error handling
 * - no inversion of forecast days and temperature scale
 * - simpler display of forecast data
 */

require("dotenv").config();
require("colors");

const axios = require("axios");
const API_KEY = process.env.API_KEY;
const [ city, measurement="C", forecast="1" ] = process.argv.slice(2);

const useF = measurement.toUpperCase() === "F"
// Get an integer number of days for the forecast display.
// Accept any number of days between 1 and 5
let days = Math.max(1, Math.min(parseInt(forecast) || 1, 5))

const range = (days === 1)
            ? "current"
            : "forecast"
const url   = `http://api.weatherapi.com/v1/${range}.json?key=${API_KEY}&q=${city}&days=${days}`;

axios
  .get(url)
  .then(response => display(response.data))
  .catch(error => console.log("There was an error"))

function display(data) {
  const { location, current, forecast } = data
  const { name, country } = location

  const temp = useF
             ? current.temp_f + " °F"
             : current.temp_c + " °C"
      
  console.log("@@@@@@@@@@@@@@@@@@@");
  console.log("@ WEATHER PROGRAM @");
  console.log("@@@@@@@@@@@@@@@@@@@\n");
  console.log("City Name :".yellow, name);
  console.log("Country :".red, country);
  console.log("Current Temp :".blue, temp);
  console.log(
    "Current Condition :".brightMagenta, current.condition.text
  );

  console.log(`\nit is now ${temp} in ${name}, ${country}`)

  if (forecast) {
    // With a free plan, you only get a maximum of 3 days' forecast
    days = Math.min(days, forecast.forecastday.length)
    // Get the number of days as a word
    const count = [0, 1, "two", "three", "four", "five"][days]

    console.log(`up to ${count} days forecast`.bgMagenta);
    forecast.forecastday.map((el) => {
      const { date, day } = el
      const temp = useF 
                 ? day.avgtemp_f + " °F"
                 : day.avgtemp_c + " °C"
      console.log(
        date, temp, day.condition.text);
    });
  }
}