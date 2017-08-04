const path = require('path');
const Store = require('jfs');
const _ = require('lodash');
const baseDir = path.join(__dirname, '..');

class Storage {
  constructor(path) {
    this.db = this._initDb(path);
  }

  get(id, cb) {
    this.db.get(id, cb);
  }

  save(data, cb) {
    this.db.save(data.id, data, cb);
  }

  all(cb) {
    this.db.all(this._objectsToList(cb));
  }

  _initDb(path) {
    return new Store(path, { saveId: 'id' });
  }

  _objectsToList(cb) {
    return (err, data) => {
      if (err) {
        cb(err, data);
      } else {
        cb(err, Object.keys(data).map(key => data[key]));
      }
    };
  }
}

class IdentifiedStorage extends Storage {
  constructor(storage, id) {
    super(storage);
    this.id = this._formatId(id);
  }

  get(cb) {
    this.db.get(this.id, cb);
  }

  save(data, cb = () => {}) {
    this.db.save(this.id, data, cb);
  }

  update(data, cb) {
    this.get((err, old) => {
      this.save(_.extend({}, old, data), cb);
    });
  }

  _initDb(storage) {
    return storage.db;
  }

  _formatId(id) {
    return id
      .replace(new RegExp(`^${baseDir}`), '')
      .replace(/\.js$/, '')
      .replace(/\//g, '__');
  }
}

module.exports = config => {
  if (!config) {
    config = { path: './' };
  }

  const teams = new Storage(`${config.path}/teams`);
  const users = new Storage(`${config.path}/users`);
  const channels = new Storage(`${config.path}/channels`);

  const common = new Storage(`${config.path}/common`);
  const global = new IdentifiedStorage(common, 'global');

  const storage = {
    teams,
    users,
    channels,

    common,
    global,
    of(id) {
      return new IdentifiedStorage(common, id);
    }
  };

  return storage;
};
