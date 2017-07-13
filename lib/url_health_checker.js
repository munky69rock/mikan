const URL = require('url');
const request = require('request');
const _ = require('lodash');

module.exports = (urls, callback) => {
  const url_map = urls.reduce((map, url) => {
    const url_obj = URL.parse(url);
    const domain = `${url_obj.protocol}//${url_obj.host}`;
    if (!map[domain]) {
      map[domain] = [];
    }
    map[domain].push(url_obj);
    return map;
  }, {});

  let valid_urls = [];
  let queue_size = Object.values(url_map).length;

  _.each(url_map, (v, k) => {
    request.head(k, { timeout: 1000 }, (e, r) => {
      if (!e && r.statusCode == 200) {
        valid_urls = valid_urls.concat(k);
      }
      queue_size -= 1;
      if (queue_size === 0) {
        callback(valid_urls);
      }
    });
  });
};
