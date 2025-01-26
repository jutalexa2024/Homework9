import { fileURLToPath } from 'node:url';
import path from "path";
import fs from 'node:fs'
import { randomUUID } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties

interface City {
name:string;
id: string;
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const fileStorage = await fs.promises.readFile(path.resolve(__dirname, '../../db/db.json'), 'utf8')
    return JSON.parse(fileStorage) 
  }

  async getCities(){
    const cities = await this.read();
    return cities;
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.promises.writeFile(path.resolve(__dirname, '../../db/db.json'), JSON.stringify(cities));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    
    const cities = await this.read();
  
    const id = randomUUID();
    const newCity = { id, name: city }

    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();

    const filtered = cities.filter((city: City) =>{
      return  city.id !== id;
    });

    await this.write(filtered);
  }

}

export default new HistoryService();
