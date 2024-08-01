import 'modern-normalize';
import './style.css';
import VcWeatherAPI from './visualCrossingAPI';

document.addEventListener(
  'DOMContentLoaded',
  () =>
    new SearchController(
      document.querySelector('#search-location-form'),
      document.querySelector('#search')
    )
);

class SearchController {
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
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }
}

class WeatherAdapter {
  constructor() {
    this.api = new VcWeatherAPI();
  }

  async getLocationData(locationString) {
    const data = await this.api.getLocationData(locationString);
    return data;
  }
}
