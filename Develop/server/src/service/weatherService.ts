import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object

class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number; 
  date: number;
  weatherDescription: string;
  icon: any;
  

  constructor(temperature: number, humidity: number,   weatherDescription: string, windSpeed: number, date:number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.weatherDescription = weatherDescription;
    this.windSpeed = windSpeed;
    this.date = date;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private cityName: string;

  constructor() {
      if (!process.env.API_KEY) {
          throw new Error('API_KEY is not defined in the environment variables.');
      }
      if (!process.env.API_BASE_URL) {
          throw new Error('API_BASE_URL is not defined in the environment variables.');
      }

      this.apiKey = process.env.API_KEY;
      this.baseURL = process.env.API_BASE_URL;
      this.cityName = ""; 
  }

//TODO: Create fetchLocationData method
private async fetchLocationData(basequery: string) {
    const apiKey = this.apiKey; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(basequery)}&appid=${apiKey}`;
  
    if (!basequery || typeof basequery !== 'string') {
      throw new Error('Invalid basequery parameter');
    }
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error fetching location data: ${response.statusText}`);
        }

        const data = await response.json();


        const { lat, lon } = data.coord;

        return { lat, lon };
    } catch (error) {
      console.error(`Error fetching data for query "${basequery}":`, error);       

    }
}

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData || locationData.lat == null || locationData.lon == null) {
        throw new Error('Invalid location data: Missing latitude or longitude');
    }
    return { lat: locationData.lat, lon: locationData.lon };
}



  // TODO: Create buildGeocodeQuery method
private buildGeocodeQuery(city: string, apiKey: string): string {

      if (!city || typeof city !== 'string') {
          throw new Error('Invalid city parameter');
      }
      if (!apiKey || typeof apiKey !== 'string') {
          throw new Error('Invalid API key');
      }

      const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const query = `?q=${encodeURIComponent(city)}&appid=${apiKey}`;
      return baseUrl + query;
}

  

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates, apiKey: string): string {
    if (!coordinates) {
        throw new Error('Coordinates object is missing');
    }
    if (coordinates.lat == null || coordinates.lon == null) {
        throw new Error('Invalid coordinates: Both latitude and longitude are required');
    }
    if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('Invalid API key');
    }

    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const params = new URLSearchParams({
        lat: coordinates.lat.toString(),
        lon: coordinates.lon.toString(),
        appid: apiKey,
    });
    return `${baseUrl}?${params.toString()}`;
}

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string, apiKey: string): Promise<Coordinates | null> {
    try {

        if (!city || typeof city !== 'string') {
            throw new Error('Invalid city name');
        }
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('Invalid API key');
        }

        const geocodeQuery = this.buildGeocodeQuery(city, apiKey);

        const response = await fetch(geocodeQuery);

        if (!response.ok) {
            throw new Error(`Error fetching location data: ${response.statusText}`);
        }

        const locationData = await response.json();

        if (!locationData.coord || locationData.coord.lat == null || locationData.coord.lon == null) {
            throw new Error('Invalid location data format: Missing coordinates');
        }
        const { lat, lon } = locationData.coord;

        return { lat, lon };

    } catch (error) {
        console.error(`Failed to fetch and destructure location data`);
        return null;
    }
}


  // TODO: Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
      const { lat, lon } = coordinates;
      const apiKey = this.apiKey;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // Use 'imperial' for Fahrenheit
  
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error fetching weather data:', error);
          throw error;
      }
  }
  

  // TODO: Build parseCurrentWeather method
    private parseCurrentWeather(response: any) {
      return {
          city: response.name,
          temperature: response.main.temp,
          feelsLike: response.main.feels_like,
          humidity: response.main.humidity,
          date: response.main.date,
          weatherDescription: response.weather[0].description,
          windSpeed: response.wind.speed,
          icon: response.weather[0].icon
      };
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((data) => {
        return {
            date: data.dt_txt,
            temperature: data.main.temp,
            weatherDescription: data.weather[0].description,
            icon: data.weather[0].icon
        };
    });

    forecastArray.unshift({
      date: 'Now',
      temperature: currentWeather.temperature,
      weatherDescription: currentWeather.weatherDescription,
      icon: currentWeather.icon,
  });

    return forecastArray;
}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
        // Replace with your actual API key and endpoint
        const apiKey = this.apiKey; // Make sure to use your actual API key
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);

        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }

        const data = await response.json();

        // Parse the current weather and forecast data
        const currentWeather = this.parseCurrentWeather(data.list[0]); // Assuming the first item is the current weather
        const forecastArray = this.buildForecastArray(currentWeather, data.list);

        return {
            currentWeather,
            forecast: forecastArray
        };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to retrieve weather data');
    }
}}

export default new WeatherService();
