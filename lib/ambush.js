const _ = require('lodash');

class Ambush {
  constructor(storage) {
    this.data = {};
    this.storage = storage;

    this.save = _.debounce(() => { this._save(); }, 500);
  }

  load() {
    this.storage.get((err, data) => {
      if (data) {
        this.data = _.defaults({}, this.data, data);
      }
    });
  }

  _save() {
    this.storage.update(this.data);
  }

  push(toUser, fromUser, message) {
    if (!this.data[toUser]) {
      this.data[toUser] = [];
    }
    this.data[toUser].push([fromUser, message]);
    this.save();
  }

  pop(user) {
    const items = this.data[user] || [];
    delete this.data[user];
    this.save();
    return items.map(m => {
      return { user: m[0], message: m[1] };
    });
  }

  isEmpty() {
    return _.isEmpty(this.data);
  }
}

module.exports = Ambush;
