import './styles/jass.css';
import dotenv from 'dotenv';
dotenv.config();


// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (name: string): Promise<void> => {
  const apiKey = process.env.API_KEY;

  // Fetch current weather
  try {
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${apiKey}&units=imperial`
    );

    if (!currentWeatherResponse.ok) {
      throw new Error(`Error fetching weather data: ${currentWeatherResponse.statusText}`);
    }

    const currentWeatherData = await currentWeatherResponse.json();

    // Render current weather
    renderCurrentWeather({
      city: currentWeatherData.name,
      date: new Date().toLocaleDateString(),
      icon: currentWeatherData.weather[0].icon,
      iconDescription: currentWeatherData.weather[0].description,
      tempF: currentWeatherData.main.temp,
      windSpeed: currentWeatherData.wind.speed,
      humidity: currentWeatherData.main.humidity,
    });

    // Extract coordinates for forecast
    const { lat, lon } = currentWeatherData.coord;

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Error fetching forecast data: ${forecastResponse.statusText}`);
    }

    const forecastData = await forecastResponse.json();

    // Render forecast (you should define renderForecast for this)
    renderForecast(forecastData.list);

  } catch (error) {
    console.error('Error in fetchWeather:', error);
    throw new Error('Failed to retrieve weather data');
  }
};


// const fetchWeather = async (name: string) => {
//   const response = await fetch('/api/weather/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ name }),
//   });

//   const weatherData = await response.json();

//   console.log('weatherData: ', weatherData);

//   renderCurrentWeather(weatherData[0]);
//   renderForecast(weatherData.slice(1));
// };

const fetchSearchHistory = async () => {
  const history = await fetch('/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history;
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/*

Render Functions

*/

// const renderCurrentWeather = (currentWeather: any): void => {
//   const { city, date, icon, iconDescription, tempF, windSpeed, humidity } =
//     currentWeather;

//   // convert the following to typescript
//   heading.textContent = `${city} (${date})`;
//   weatherIcon.setAttribute(
//     'src',
//     `https://openweathermap.org/img/w/${icon}.png`
//   );
//   weatherIcon.setAttribute('alt', iconDescription);
//   weatherIcon.setAttribute('class', 'weather-img');
//   heading.append(weatherIcon);
//   tempEl.textContent = `Temp: ${tempF}°F`;
//   windEl.textContent = `Wind: ${windSpeed} MPH`;
//   humidityEl.textContent = `Humidity: ${humidity} %`;

//   if (todayContainer) {
//     todayContainer.innerHTML = '';
//     todayContainer.append(heading, tempEl, windEl, humidityEl);
//   }
// };


interface CurrentWeather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

const renderCurrentWeather = (currentWeather: CurrentWeather): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  // Ensure all DOM elements exist (no need to query them again)
  if (!heading || !tempEl || !windEl || !humidityEl || !todayContainer || !weatherIcon) {
    console.error('One or more required DOM elements are missing.');
    return;
  }

  // Update heading with city and date
  heading.textContent = `${city} (${date})`;

  // Configure the weather icon
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');

  // Update weather details
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  // Clear and update the container
  todayContainer.innerHTML = '';
  todayContainer.append(heading, tempEl, windEl, humidityEl, weatherIcon);
};


const renderForecast = (forecastData: any[]): void => {
  // Ensure the forecast container exists (no need to query it again)
  if (!forecastContainer) {
    console.error('Forecast container is missing');
    return;
  }

  // Clear previous forecast data
  forecastContainer.innerHTML = '';

  // Add a heading for the forecast
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');
  heading.textContent = '5-Day Forecast:';
  headingCol.setAttribute('class', 'col-12');
  headingCol.append(heading);
  forecastContainer.append(headingCol);

  // Loop through the forecast data and render individual forecast cards
  forecastData.forEach(forecast => {
    renderForecastCard(forecast);
  });
};




// const renderForecast = (forecast: any): void => {
//   const headingCol = document.createElement('div');
//   const heading = document.createElement('h4');

//   headingCol.setAttribute('class', 'col-12');
//   heading.textContent = '5-Day Forecast:';
//   headingCol.append(heading);

//   if (forecastContainer) {
//     forecastContainer.innerHTML = '';
//     forecastContainer.append(headingCol);
//   }

//   for (let i = 0; i < forecast.length; i++) {
//     renderForecastCard(forecast[i]);
//   }
// };


const renderForecastCard = (forecast: any) => {
  const { dt, main, weather, wind } = forecast;

  // Extract the necessary data
  const date = new Date(dt * 1000).toLocaleDateString(); // Convert timestamp to date string
  const icon = weather[0].icon;
  const iconDescription = weather[0].description;
  const tempF = main.temp;
  const windSpeed = wind.speed;
  const humidity = main.humidity;

  // Create the forecast card elements
  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
}

  // Append the forecast card to the container
  // Reuse global fo


// const renderForecastCard = (forecast: any) => {
//   const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

//   const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
//     createForecastCard();

//   // Add content to elements
//   cardTitle.textContent = date;
//   weatherIcon.setAttribute(
//     'src',
//     `https://openweathermap.org/img/w/${icon}.png`
//   );
//   weatherIcon.setAttribute('alt', iconDescription);
//   tempEl.textContent = `Temp: ${tempF} °F`;
//   windEl.textContent = `Wind: ${windSpeed} MPH`;
//   humidityEl.textContent = `Humidity: ${humidity} %`;

//   if (forecastContainer) {
//     forecastContainer.append(col);
//   }
// };

const renderSearchHistory = async (searchHistory: any) => {
  const historyList = await searchHistory.json();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = historyList.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(historyList[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
