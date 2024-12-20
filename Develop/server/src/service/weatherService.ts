import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  x: number;
  y: number;
}
// TODO: Define a class for the Weather object

class Weather {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number; 
  date: number;

  constructor(temperature: number, humidity: number, description: string, windSpeed: number, date:number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.description = description;
    this.windSpeed = windSpeed;
    this.date = date;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private apiKey = process.env.API_KEY;
  private baseURL= process.env.API_BASE_URL;
  //private cityName: string;


  // TODO: Create fetchLocationData method
// public async fetchLocationData(basquery: string) {
 
//     fetch(baseURL)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//     });
  
// }
// }
  // TODO: Create destructureLocationData method
  //public destructureLocationData(locationData: Coordinates): Coordinates {

  // TODO: Create buildGeocodeQuery method
  //private buildGeocodeQuery(): string {
    
  
  // TODO: Create buildWeatherQuery method
  //private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  //private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  //private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  //private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  //private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  //async getWeatherForCity(city: string) {}
}

export default new WeatherService();
