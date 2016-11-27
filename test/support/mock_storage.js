const _ = require('lodash');

class MockStorage {
  constructor() {
    this.db = {};
  }

  get(cb = () => {}) {
    cb(null, this.db);
  }

  save(data, cb = () => {}) {
    this.db = data;
    cb(null, data);
  }

  update(data, cb = () => {}) {
    this.get((err, old) => {
      this.save(_.extend({}, old, data), cb);
    });
  }
}

module.exports = MockStorage;
