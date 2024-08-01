import 'modern-normalize';
import './style.css';
import VcWeatherAPI from './visualCrossingAPI';

document.addEventListener(
  'DOMContentLoaded',
  () =>
    new ScreenController(
      document.querySelector('#search-location-form'),
      document.querySelector('#search'),
      document.querySelector('.location-header'),
      document.querySelector('.card-container')
    )
);

class ScreenController {
  constructor(form, searchInput, locationHeader, cardContainer) {
    this.form = form;
    this.input = searchInput;
    this.locationHeader = locationHeader;
    this.cardContainer = cardContainer;
    this.weather = new WeatherAdapter();

    this.form.addEventListener('submit', (event) => this.onUserSearch(event));
  }

  async onUserSearch(event) {
    event.preventDefault();
    const location = this.input.value;
    this.input.value = '';

    try {
      const data = await this.weather.getLocationData(location);
      this.initializeHTML(data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  initializeHTML(data) {
    this.locationHeader.textContent =
      data.location.charAt(0).toUpperCase() +
      data.location.slice(1).toLowerCase();
    this.cardContainer.innerHTML = '';

    for (const dayData of data.days) {
      const card = this.constructCard(dayData);
      this.cardContainer.appendChild(card);
    }
  }

  constructCard(data) {
    const container = document.createElement('div');
    container.innerHTML = `
    <p class="temperature">${data.temp}</p>
    `;
    return container;
  }

  showError(message) {
    alert(message);
  }
}

class WeatherAdapter {
  constructor() {
    this.api = new VcWeatherAPI();
  }

  #standardizeData(data) {
    /*
    Returns an object with the following attributes:

    1. location: string

    2. days: Array of at least 1 object
    Each object represents a day, ordered (index 0 - current, index 1 - next), and must have the following attributes:

    temp: float, tempmin: float, tempmax: float, humidity: float, windspeed: float, conditions: string, datetime: string 'yyyy-dd-mm'
    icon: in set {'snow', 'rain', 'fog', 'wind', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'clear-day', 'clear-night'}
    */
    data.days['0'].temp = data.currentConditions.temp;

    return {
      location: data.address,
      days: [
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
