import { Router } from 'express';
const router = Router();
import fs from 'fs/promises';

import { v4 as uuidv4 } from 'uuid';

//import HistoryService from '../../service/historyService.js';
//import WeatherService from '../../service/weatherService.js';

//TODO: POST Request with city name to retrieve weather data
const OPENWEATHER_API_KEY = process.env.API_KEY; // Use environment variables for API key
const OPENWEATHER_API_URL = process.env.API_BASE_URL;
router.post('/', async (req, res) => {
  const cityName = req.body.name; // Extract city name from the request body
  console.log(cityName); // Debugging log

  // Validate city name
  if (!cityName || typeof cityName !== 'string' || cityName.trim() === '') {
    return res.status(400).json({ error: 'City name is required and must be a non-empty string' });
  }

  try {
    // Fetch weather data from OpenWeather API
    const response = await fetch(`${OPENWEATHER_API_URL}${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}`);
    console.log(response);
    const weatherData = await response.json();
    console.log(weatherData);

    if (response.ok) {
      const searchHistoryPath = 'src/data/searchHistory.json'; // Check this path

      let history = [];
      try {
        // Read existing search history
        const searchHistory = await fs.readFile(searchHistoryPath, 'utf8');
        history = JSON.parse(searchHistory);
      } catch (error) {
        console.warn('No search history file found, initializing new file.');
      }

      // Add new city to history
      history.push({ id: uuidv4(), city: cityName });
      await fs.writeFile(searchHistoryPath, JSON.stringify(history, null, 2)); // Write updated history

      // Return weather data
      return res.status(200).json(weatherData);
    } else {
      return res.status(404).json({ error: 'City not found' });
    }
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    return res.status(500).json({ error: 'Error retrieving weather data' });
  }
});


// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        // Read the searchHistory.json file
        const data = await fs.readFile('server/src/data', 'utf8');
        // Parse the JSON data
        const history = JSON.parse(data);
        // Send the history as a JSON response
        res.status(200).json(history);
    } catch (error) {
        console.error('Error reading search history:', error);
        res.status(500).json({ message: 'Error retrieving search history' });
    }
});

// * BONUS TODO: DELETE city from search history
//router.delete('/history/:id', async (_req, _res) => {});

export default router;
