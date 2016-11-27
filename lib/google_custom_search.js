const request = require('request');
const URL = require('url');

class GoogleCustomSearch {
  constructor() {
    this.apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    this.id     = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
    this.url    = URL.parse('https://www.googleapis.com/customsearch/v1');
  }

  isAvailable() {
    return this.apiKey && this.id;
  }

  searchImage(q, callback) {
    if (!this.isAvailable()) {
      return;
    }

    this.url.query = {
      key: this.apiKey,
      cx: this.id,
      q: q,
      searchType: 'image'
    };

    request.get(URL.format(this.url), (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return;
      }
      const result = JSON.parse(body);
      callback(result);
    });
  }
}

module.exports = new GoogleCustomSearch();
