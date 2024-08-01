import 'modern-normalize';
import './style.css';
import VcWeatherAPI from './visualCrossingAPI';
import pexelsAPI from './pexelsAPI';
import { format, parse, isToday } from 'date-fns';

import snowIcon from './icons/snow.svg';
import rainIcon from './icons/rain.svg';
import fogIcon from './icons/fog.svg';
import windIcon from './icons/wind.svg';
import cloudyIcon from './icons/cloudy.svg';
import partlyCloudyDayIcon from './icons/partly-cloudy-day.svg';
import partlyCloudyNightIcon from './icons/partly-cloudy-night.svg';
import clearDayIcon from './icons/clear-day.svg';
import clearNightIcon from './icons/clear-night.svg';

document.addEventListener(
  'DOMContentLoaded',
  () =>
    new ScreenController(
      document.querySelector('#search-location-form'),
      document.querySelector('#search'),
      document.querySelector('.location-header'),
      document.querySelector('.card-container'),
      {
        snow: snowIcon,
        rain: rainIcon,
        fog: fogIcon,
        wind: windIcon,
        cloudy: cloudyIcon,
        'partly-cloudy-day': partlyCloudyDayIcon,
        'partly-cloudy-night': partlyCloudyNightIcon,
        'clear-day': clearDayIcon,
        'clear-night': clearNightIcon,
      }
    )
);

class ScreenController {
  constructor(form, searchInput, locationHeader, cardContainer, icons) {
    this.form = form;
    this.input = searchInput;
    this.locationHeader = locationHeader;
    this.cardContainer = cardContainer;
    this.icons = icons;
    this.weather = new WeatherAdapter();
    this.background = new backgroundAdapter();

    this.form.addEventListener('submit', (event) => this.onUserSearch(event));
  }

  async onUserSearch(event) {
    event.preventDefault();
    const location = this.input.value;
    this.input.value = '';

    try {
      const data = await this.weather.getLocationData(location);
      this.setBackground(location + ' ' + data.days[0].conditions);
      this.initializeHTML(data);
    } catch (error) {
      this.showError(error.message);
    }
  }

  async setBackground(query) {
    const url = await this.background.getBackgroundUrl(query);
    if (url) {
      document.body.style.backgroundImage = `url(${url})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backdropFilter = 'blur(1px)';
    }
  }

  initializeHTML(data) {
    this.locationHeader.textContent = data.location;
    this.cardContainer.innerHTML = '';

    for (const dayData of data.days) {
      const card = this.constructCard(dayData);
      this.cardContainer.appendChild(card);
    }
  }

  constructCard(data) {
    const parsedDate = parse(data.datetime, 'yyyy-MM-dd', new Date());
    const formattedDate = format(parsedDate, 'MMMM d, yyyy');
    const dayOfWeek = format(parsedDate, 'EEEE');
    const today = isToday(parsedDate);

    const container = document.createElement('div');
    container.classList.add('card');

    container.innerHTML = `
    <div class="card-header">
        <p class="day-of-week">${dayOfWeek}${today ? ' (Today)' : ''}</p>
        <p class="date">${formattedDate}</p>
        <p class="humidity">Humidity ${Math.floor(data.humidity)}%</p>
        <p class="windspeed">Wind speed ${Math.round(data.windspeed)} km/h</p>
    </div>
    <div class="card-body">
        <img src="${this.icons[data.icon]}" alt="${data.conditions}" 
        class="weather-icon">
        <p class="temperature">${Math.round(data.temp)}°C</p>
        <p class="conditions">${data.conditions}</p>
        <p class="temperature-range">
        ${Math.round(data.tempmin)}°C / ${Math.round(data.tempmax)}°C
        </p>
    </div>
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

    Celsius
    temp: float, tempmin: float, tempmax: float, humidity: float, windspeed: float, conditions: string, datetime: string 'yyyy-MM-dd'
    icon: in set {'snow', 'rain', 'fog', 'wind', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'clear-day', 'clear-night'}
    */
    data.days['0'].temp = data.currentConditions.temp;

    return {
      location: data.resolvedAddress,
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

class backgroundAdapter {
  constructor() {
    this.api = new pexelsAPI();
  }

  async getBackgroundUrl(query) {
    const data = await this.api.getBackground(query);

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.original;
      return imageUrl;
    } else {
      console.error('No images found for the location.');
      return null;
    }
  }
}
