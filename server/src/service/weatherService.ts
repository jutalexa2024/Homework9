import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat:number;
  lon: number;
  name: string;
  state: string;
  country: string;
}

interface Weather{
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  private baseURL: string = 'https://api.openweathermap.org';
  private apiKey: string = process.env.API_KEY || '';
  
  private cityName: string;

  constructor(){
    this.cityName ='';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string, requestId: string) {
    console.log(requestId, 'fetchLocationData');
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}`);
    const data = await response.json();
    return data; 
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates, requestId:string): Coordinates {
    console.log(requestId, 'destructureLocationData');
    const { lat, lon, name, state, country} = locationData;
    return {lat, lon, name, state, country};
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(requestId:string): string {
    console.log(requestId, 'buildGeocdoeQuery', this.cityName);
    return `${this.cityName}& limit=1&appid=${this.apiKey}`

  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates, requestId:string): string {
    console.log(requestId, 'buildWeatherQuery');
    const {lat,lon} = coordinates;

    return `lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData(requestId:string): Promise<Coordinates> {
    
    console.log(requestId, 'fetchAndDestructureLocationData');

    const locationQuery = this.buildGeocodeQuery(requestId);
    const locationData = await this.fetchLocationData(locationQuery, requestId);
    const coordinates = this.destructureLocationData(locationData[0], requestId);

    return coordinates;
   }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates,requestId:string) {
    console.log(requestId, 'fethWeatherData');
    const weatherQuery = this.buildWeatherQuery(coordinates, requestId);
    const response = await fetch (`${this.baseURL}/data/2.5/forecast?${weatherQuery}`);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any, requestId:string) {
    console.log(requestId,'parseCurrentWeather');
    const currentWeather = response.list[0];
    const city = response.city.name;
    const date = currentWeather.dt_txt;
    const icon = currentWeather.weather[0].icon;
    const iconDescription = currentWeather.weather[0].description;
    const tempF = currentWeather.main.temp;
    const windSpeed = currentWeather.wind.speed;
    const humidity = currentWeather.main.humidity;
    return {city, date, icon, iconDescription, tempF, windSpeed, humidity};

  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[], requestId:string) {
    console.log(requestId,`bulidForecastArray`);
    const forecast = weatherData.slice(1, 6).map((weather) =>{
      const city = currentWeather.city;
      const date = weather.dt_txt;
      const icon = weather.weather[0].icon;
      const iconDescription = weather.weather[0].description;
      const tempF = weather.main.temp;
      const windSpeed = weather.wind.speed;
      const humidity = weather.main.humidity;
      return {city, date, icon, iconDescription, tempF, windSpeed, humidity};
    });

    return [currentWeather].concat(forecast);
  }
  // TODO: Complete getWeatherForCity method

  async getWeatherForCity(city: string, requestId:string) {
    console.log(requestId, 'getWeatherForCity', city);
    this.cityName = city;
    
    const coordinates = await this.fetchAndDestructureLocationData(requestId);
    const weatherData = await this.fetchWeatherData(coordinates, requestId);
    const currentWeather = this.parseCurrentWeather(weatherData, requestId);
    const forecast = this.buildForecastArray(currentWeather, weatherData.list, requestId);
    
    return forecast;
  }
}

export default new WeatherService();
