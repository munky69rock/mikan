const request = require('request');
const _ = require('lodash');
const URL = require('url');

class GoogleCustomSearch {
  constructor() {
    this.apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    this.id = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
    this.url = URL.parse('https://www.googleapis.com/customsearch/v1');
  }

  isAvailable() {
    return this.apiKey && this.id;
  }

  searchKeyword(q, callback) {
    this._search({ q: q }, callback);
  }

  searchImage(q, callback) {
    this._search({ q: q, searchType: 'image' }, callback);
  }

  _search(params, callback) {
    if (!this.isAvailable()) {
      return;
    }

    this.url.query = _.defaults(
      {
        key: this.apiKey,
        cx: this.id
      },
      params
    );

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
