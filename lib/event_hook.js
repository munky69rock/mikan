const logger = require.main.require('./lib/logger.js');

class EventHook {
  constructor(events = [], initializer) {
    this.events = {};
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

  trigger(event, cb) {
    if (!this.events[event]) {
      logger.warn(`${event} is not configured`);
      return;
    }
    this.events[event].forEach(cb);
  }
}

module.exports = EventHook;
