// Obtain an API key by registering at https://weatherapi.com
// Create a file named .env in the same folder as this script
// and give it the text:
// API_KEY=whateverAPIkeyTheWeatherAPIsiteGaveYou

require("dotenv").config()
const API_KEY = process.env.API_KEY

const axios = require('axios')

// Get individual commands from the colors node module
var colors = require('colors');
const { white, blue, green, yellow, red, rainbow } = colors

// Skip first 2 entries from the command line, apply defaults
let [,,city, days=1, scale="C"] = process.argv

// Allow days and scale to be inverted in the command line
if (!isNaN(scale)) {
    [ scale, days ] = [ days, scale ]
}

// Force days to be a number between 1 and 5, even if it is
// invalid
days = Math.max(1, Math.min(parseInt(days, 10) || 1, 5))
const useF = scale.toUpperCase() === "F" // in all other cases, use °C

// Generate the appropriate URL from the number of days
// requested
const [ range, forecast ] = ( days === 1 )
                      ? [ "current", "" ]
                      : [ "forecast", `&days=${days}` ]
const url = `http://api.weatherapi.com/v1/${range}.json?key=${API_KEY}&q=${city}${forecast}`;


// Call functions with .then and .catch to make debugging easier
axios.get(url)
  .then(displayWeather)
  .catch(showError)


/**
 * showError is called if the promise returned by axios.get() is
 * rejected, or if there is a script error anywhere in 
 * displayWeather
 */
function showError(error) {
    if ( error.response) { // Error in API call
        const { status, statusText } = error.response
        console.log(red(`${error.message}: ${statusText}`))

        // Give troubleshooting details for common problems
        switch (status) {
            case 400:
                console.log(yellow("City names must be at least 3 characters long."))
                // There may be other reasons for this error?
            break
            case 401: // Unauthorised
                console.log(red("Check your API_KEY in the .env file"))
                console.log("or apply for at API_KEY at https://weatherapi.com and add it to your .env file.\n")
        }

    } else { // Script error with stack trace
        console.log("Error:", error);
    }
}


/**
 * displayWeather is called if the API call is successful
 */
function displayWeather(response) {
    const { location, current, forecast } = response.data

    const { name, country } = location
    // Check if the API "corrected" the requested city name
    if (city !== name) {
        console.log(red("Error: "), `No weather data for "${city}" found. Perhaps you meant ${name}? Please check your spelling.`);
        process.exit(9) // Invalid argument
    }

    // Header for today's weather and for a forecust
    console.log(white.inverse("\n  @@@@@@@@@@@@@@@@@@@  "));
    console.log(blue.inverse("  @ WEATHER PROGRAM @  "));
    console.log(white.inverse("  @@@@@@@@@@@@@@@@@@@  "));

    // Select the right temperature scale
    const temp = useF
                ? current.temp_f + "°F"
                : current.temp_c + "°C"

    if (forecast) {
      // Show current temperature and N days forecast
      // With a free plan, you only get a maximum of 3 days'
      // forecast
        const { forecastday } = forecast
        const count = [,, "TWO", "THREE", "FOUR", "FIVE"][forecastday.length]

        console.log(
            "\nIn",
            green(`${name}`),
            "the current temperature is:",
            yellow(temp),
        );
        console.log(
            blue("\n* THE WEATHER FORECAST FOR",
            green(`${name.toUpperCase()}`),
            `FOR THE NEXT ${count} DAYS *\n`)
        );

        forecastday.map(e => {
            const { day, date, astro } = e
            const { avgtemp_c, avgtemp_f, condition } = day
            const temp = useF
                ? avgtemp_f + "°F"
                : avgtemp_c + "°C"
            const { sunrise, sunset } = astro
            console.log("Day:", red(date));
            console.log("Average Temperature:", yellow(temp));
            console.log("Weather Conditions:", yellow(`${condition.text}`));
            console.log("Sunrise:", yellow(sunrise), "\n", "Sunset:", yellow(sunset), "\n");
        });

    } else { // Just today's weather
        const conditions = current.condition.text
        console.log("\nIt is now", green(`${temp}`), "in", yellow(`${name}, ${country}`));
        console.log(
            "The current weather conditions are :",
            rainbow(`"${conditions}"\n`)
        );
    }
}