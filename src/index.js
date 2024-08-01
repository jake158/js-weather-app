import 'modern-normalize';
import './style.css';
import VcWeatherAPI from './visualCrossingAPI';

document.addEventListener(
  'DOMContentLoaded',
  () =>
    new ScreenController(
      document.querySelector('#search-location-form'),
      document.querySelector('#search')
    )
);

class ScreenController {
  constructor(form, searchInput) {
    this.form = form;
    this.input = searchInput;
    this.weather = new WeatherAdapter();

    this.form.addEventListener('submit', (event) => this.onUserSearch(event));
  }

  async onUserSearch(event) {
    event.preventDefault();
    const location = this.input.value;
    try {
      const data = await this.weather.getLocationData(location);
      this.initializeCards(data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  initializeCards(data) {
    console.log(data);
  }

  showError(message) {
    console.error(message);
  }
}

class WeatherAdapter {
  constructor() {
    this.api = new VcWeatherAPI();
  }

  #standardizeData(data) {
    /*
    Returns an object with the following attributes:

    1. address: string

    2. data: Array of 5 objects
    Each object represents a day, ordered (index 0 - current, index 1 - next), and must have the following attributes:
    temp: float, tempmin: float, tempmax: float, humidity: float, windspeed: float, conditions: string
    icon: in set {'snow', 'rain', 'fog', 'wind', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'clear-day', 'clear-night'}
    */
    data.days['0'].temp = data.currentConditions.temp;

    return {
      address: data.address,
      data: [
        data.days['0'],
        data.days['1'],
        data.days['2'],
        data.days['3'],
        data.days['4'],
      ],
    };
  }

  async getLocationData(locationString) {
    const data = await this.api.getLocationData(locationString);
    return this.#standardizeData(data);
  }
}
