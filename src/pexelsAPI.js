export default class pexelsAPI {
  constructor() {
    // Public API, I am fine with exposing key
    this.key = 'nYRaYsLrdsA53YGX4S26JKzBrmZh53O6MviQt5uwxQvV4wBue3jrVdz1';
  }

  async fetchImages(query) {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=15&orientation=landscape`,
      {
        method: 'GET',
        headers: {
          Authorization: this.key,
        },
      }
    );

    if (!response.ok) {
      console.error(`HTTP error, status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.photos;
  }
}
