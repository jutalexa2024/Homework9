import { Router } from 'express';
const router = Router();

import { v4 as uuidv4 } from 'uuid';

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
// router.post('/', async (req, res) => {
//   try {
//     const { city } = req.body;

//     if (!city) {
//       return res.status(400).json({ error: 'City name is required' });
//     }

//     // Fetch weather data
//     const weatherData = await WeatherService.fetchLocationData(city);

//     // Save city to search history
//     if (!searchHistory.includes(city)) {
//       searchHistory.push(city);
//     }

//     // Respond with the weather data
//     res.status(200).json({
//       success: true,
//       data: weatherData,
//       message: `${city} weather retrieved successfully`,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to retrieve weather data' });
//   }
// });

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
