const logger = require.main.require('./lib/logger.js');

class EventHook {
  constructor(events = [], initializer) {
    this.events = {};
    if (typeof events === 'string') {
      events = [events];
    }
    events.forEach(e => {
      this.events[e] = [];
    });

    if (initializer) {
      initializer(this);
    }
  }

  add(event, cb) {
    if (!this.events[event]) {
      logger.warn(`${event} is not configured`);
      return;
    }
    this.events[event].push(cb);
  }

  trigger(event, callback) {
    if (!this.events[event]) {
      logger.warn(`${event} is not configured`);
      return;
    }
    this.events[event].forEach(cb => callback(cb));
  }
}

module.exports = EventHook;
