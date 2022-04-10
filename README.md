# Weather CLI 

Get the latest weather report - from your terminal!

## What you will be doing

You will be writing a CLI application which uses an external API to get weather information.

The user will provide a city name when they run the program. Your program must use that city name in its request - and print the results into the terminal.

### Example

###### Command
```bash
$ node weather.js manchester
```

###### Response
```bash
@@@@@@@@@@@@@@@@@@@
@ WEATHER PROGRAM @
@@@@@@@@@@@@@@@@@@@

It is now 15.25°C in Manchester

The current weather conditions are: scattered clouds
```

## Tasks

### Task 1 - Getting an API

1. There are many weather APIs to choose one. Sign up for a free account from **one** API on the list below, or find your own;

   - [OpenWeatherMap API](https://openweathermap.org/)
   - [Weather API](https://www.weatherapi.com/)

2. Make note of your API key. You will need this later.
3. Read through the API documentation to understand how to use it

### Task 2 - Setting up the project

1. Initalize `npm` with the `npm init -y` command
2. Install the `axios` library - we will use this to create our network requests
3. Install the `dotenv` library - we will use it to create our environment variables
4. Create the file `weather.js`

### Task 2 - The API key

1. Create the file `.env`
2. Inside this file, store your API key

   ###### Example
   
   ```text
   KEY = 32476f984jf83jf9fdksu32928475
   ```
   
3. Create a `.gitignore` file, and add the reference `.env`

### Task 3 - Making the request

Inside `weather.js`;

1. Read the city from the user
    > Hint: You can use `process.argv`
2. Import and use the [dotenv](https://github.com/motdotla/dotenv) library to read the API key from your `process.env` environment
3. Import and use the [axios](https://github.com/axios/axios) to request the information from the API

### Task 4 - The output

Read through the returned data from your API and display;

- The city name
- The current temperature
- The current weather conditions
- Anything else you might like to add

> Hint: You might also like to consider using the [colors.js](https://github.com/Marak/colors.js) library to make your output fabulous 🤩! 

## Bonus Tasks

Your program should be also able to;

- Display a 5-day forecast
- Allow the user to switch between **metric** and **imperial** measurements
