import 'modern-normalize';
import './style.css';

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

  onUserSearch(event) {
    event.preventDefault();
    const location = this.input.value;
    const data = this.weather.getLocationData(location);
  }
}

class WeatherAdapter {
  constructor() {}

  getLocationData(locationString) {
    console.log(locationString);
    return null;
  }
}
