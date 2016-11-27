const _ = require('lodash');
const Interval = require('./interval.js');
const add = '++';
const subtract = '--';

class ScoreKeeper {
  constructor(storage) {
    this.storage = storage;
    this.scores = {};
    this.log = {};

    this._load();
    this._updateStorage =_.debounce(() => {
      this.storage.update(this.scores);
    }, 500);
  }

  add(user, message) {
    this._update(user, message, add);
  }

  subtract(user, message) {
    this._update(user, message, subtract);
  }

  get(user) {
    return this.scores[user] || this._defaultScore();
  }

  _defaultScore() {
    return { [add]: 0, [subtract]: 0 };
  }

  _load() {
    this.storage.get((err, data) => {
      if (!data) {
        return;
      }
      Object.keys(data).forEach(user => {
        if (user === 'id') {
          return;
        }
        try {
          this.scores[user] = JSON.parse(data[user]);
        } catch (e) {
          this.scores[user] = this._defaultScore();
        }
      });
    }); 
  }

  _save(user, message) {
    const from = message.name;
    this.log[from] = _.defaultTo(this.log[from], {});
    this.log[from][user] = new Interval();
    this._updateStorage();
  }

  _update(user, message, sym) {
    if (this._isValid(user, message)) {
      this.scores[user] = _.defaultTo(this.scores[user], this._defaultScore());
      this.scores[user][sym]++;
      this._save(user, message);
    }
  }

  _isSpam(user, from) {
    this.log[from] = _.defaultTo(this.log[from], {});

    const dateSubmitted = this.log[from][user];
    if (!dateSubmitted) {
      return false;
    }
    const isSpam = !dateSubmitted.eval();

    if (!isSpam) {
      delete this.log[from][user];
    }

    return isSpam;
  }

  _isValid(user, message) {
    const from = message.name;
    return user !== from && !_.isEmpty(user) && !this._isSpam(user, from);
  }
}

module.exports = ScoreKeeper;
