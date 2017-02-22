const holiday = require('holiday-jp');

module.exports = (day) => {
  if (holiday.isHoliday(day)) {
    return true;
  }

  const m = day.getMonth() + 1;
  const d = day.getDate();

  if (m === 12 && d > 29) {
    return true;
  }
  if (m === 1 && d < 4) {
    return true;
  }
  return false;
};
