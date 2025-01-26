import { Router } from 'express';
import{ randomUUID } from 'node:crypto';

const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {

  const requestId = randomUUID();
  console.log(requestId, "Post /api/weather", req.ip, req.path)
  console.log(requestId, req.body)
  console.log("POST /api/weather", req.body);

  try{
  const { cityName } = req.body;
  console.log(requestId, cityName);

  // TODO: GET weather data from city name

  const weather = await WeatherService.getWeatherForCity(cityName, requestId);
  // TODO: save city to search history
  await HistoryService.addCity(cityName);
  console.log("Post /api/weather", cityName);
  
  return res.status(200).json(weather);
  
} catch (error) {
  console.log("POST /api/weather", "Caught Error");
  console.error(error);
  
  if (error instanceof TypeError){
  return res.status(400).send("Bad Request")
}

return res.status(500).send("Internal Server Error");

}

});

// // TODO: GET search history
router.get('/history', async (req, res) => {
  const requestId = randomUUID();
  console.log(requestId, "GET /api/weather/history", req.ip);
  try {
    
    const cities = await HistoryService.getCities();
    res.status(200).json(cities)

  } catch (error) {
    console.log(requestId, "Caught Error");
    console.log(error);
    res.status(500).send("Internal Server Error")
  }
});

// // * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const requestId = randomUUID();
  console.log(requestId, "DELET /api/weather/history/:id", req.ip);

  const { id } = req.params;
  console.log(requestId, id);

  await HistoryService.removeCity(id);

  res.status(200).send('Deleted city with id: ${id}')

});

export default router;
