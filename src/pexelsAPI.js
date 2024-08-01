export default class pexelsAPI {
  constructor() {
    // Public API, I am fine with exposing key
    this.key = 'nYRaYsLrdsA53YGX4S26JKzBrmZh53O6MviQt5uwxQvV4wBue3jrVdz1';
  }

  async getBackground(query) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=1/`;

    const response = await fetch(url, {
      mode: 'cors',
      method: 'GET',
      headers: {
        Authorization: this.key,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to load background');
    }
    return await response.json();
  }
}
