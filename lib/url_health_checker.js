const URL = require('url');
const request = require('request');
const _ = require('lodash');

class UrlHealthChecker {
  constructor(urls) {
    this.url_map = urls.reduce((map, url) => {
      const url_obj = URL.parse(url);
      const domain = `${url_obj.protocol}//${url_obj.host}`;
      if (!map[domain]) {
        map[domain] = [];
      }
      map[domain].push(url);
      return map;
    }, {});

    this.valid_urls = [];
    this.queue_size = Object.values(this.url_map).length;
  }

  ensure(callback) {
    if (this.queue_size === 0) {
      return this._exec(callback);
    }

    _.each(this.url_map, (v, k) => {
      request.head(k, { timeout: 1000 }, (e, r) => {
        if (!e && r.statusCode == 200) {
          this.valid_urls = this.valid_urls.concat(k);
        }
        this.queue_size -= 1;
        if (this.queue_size === 0) {
          this._exec(callback);
        }
      });
    });
  }

  _exec(callback) {
    let urls = _(this.valid_urls).values().flatten().value();
    if (urls.length > 5) {
      urls = urls.slice(0, 5);
      urls.push('and more ...');
    }
    callback(urls);
  }
}

module.exports = UrlHealthChecker;
