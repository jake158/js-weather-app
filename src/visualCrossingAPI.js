export default class VcWeatherAPI {
  constructor() {
    // Public API, I am fine with exposing key
    this.key = 'LC9MU2GLW9YBGY3TZC8Z869EA';
  }

  async getLocationData(locationString) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      locationString
    )}?unitGroup=metric&key=${this.key}&contentType=json`;

    const response = await fetch(url, { mode: 'cors' });

    if (response.status !== 200) {
      throw new Error('Invalid location data');
    }
    return await response.json();
  }
}
