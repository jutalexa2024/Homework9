import fs from 'fs';
import path from 'path';

// TODO: Define a City class with name and id properties
class City {
  name:string;
  id:string;


  constructor(name:string, id:string){
  this.name = name;
  this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, 'searchHistory.json');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
  try {
    const data = await fs.promises.readFile(this.filePath, 'utf8');
    return JSON.parse(data); // Convert JSON string to an object
  }  catch (error) {
    if (error instanceof Error) {
      console.log(error.message); // Safe access
    } else {
      console.log("An unknown error occurred");
    }
  }
}

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {

    try {
      const data = JSON.stringify(cities, null, 2); // Convert cities array to JSON string with indentation
      await fs.promises.writeFile(this.filePath, data, 'utf8'); // Write JSON string to file
      console.log('Cities have been successfully written to searchHistory.json');
    } catch (error) {
      console.error('Error writing to file:', error);
    }

  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities ?? []; 
  }


  async addCity(cityName: string) {
    const cities = await this.read(); // Get the current cities from the file

    // If cities is null, initialize it as an empty array
    const updatedCities = cities ?? [];
  
    // Check if the city already exists
    const cityExists = updatedCities.some((city: { name: string; }) => city.name === cityName);
  
    if (cityExists) {
      console.log(`City "${cityName}" already exists in the search history.`);
      return; // Exit if the city already exists
    }
  
    // Create a new city object
    const newCity: City = {
      name: cityName,
      id: Math.random().toString(36) //Find a better method 
    };
  
    updatedCities.push(newCity); // Add the new city to the list
  
    await this.write(updatedCities); // Write the updated cities list back to the file
  }
  
}

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}






  export default new HistoryService();
