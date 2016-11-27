class Interval {
  constructor(interval = 5) {
    this.interval = interval;
    this.lastTime = new Date();
  }

  eval(cb) {
    const now = new Date();
    if (this.lastTime.setSeconds(this.lastTime.getSeconds() + this.interval) > now) {
      return false;
    }
    this.lastTime = now;
    if (cb) {
      cb();
    }
    return true;
  }

  static eval(date, interval) {
    return date.setSeconds(date.getSeconds() + interval) > new Date();
  }
}

module.exports = Interval;
