# Payoneer Frontend Challenge
### To run the app locally with React scripts

1. Execute `npm install` in the root folder of the challenge.
2. Execute `npm start` to host the React application on http://localhost:3000.

### To view the app on the web

1. Simply open http://tuncak30.github.io/payoneer-frontend-challenge to view the project on a browser

### Important notes before you start

1. This application uses weather forecast API;
    - **https://api.openweathermap.org**

- Although it has plenty of request limit, I also included another API_KEY in the code, if you reach the limit of one API_KEY you can use the other one.
- You will see 2 fetch lines, one of them uses Geolocation and the other one is static to Munich,de. If you want to use the geolocation to get a more precise result, you can comment out the one with Munich,de and uncomment the upper 2 lines.

### File Structure
- **src/Components** -> Sibling components that create the application
- **src/App.js** -> Parent component
- **src/Components/WeatherCards.js** -> Main cards that are appended to body after retreiving data
- **src/Components/InnerTemperatures.js** -> Little boxes inside of cards that holds the hourly weather results for that day
- **src/Components/Spinner.js** -> Just a simple spinner to show while loading data
- **src/App.css** -> Main styles of the application
- **src/index.js** -> Entry point of the application
- **src/Helpers.js** -> Helper functions for getting the Geolocation, date formatting and to detect mobile browsers
- **src/Hooks/useWindowResize.js** -> Custom hook to listen windowresize to change the page size on mobile/desktop (1,3)
