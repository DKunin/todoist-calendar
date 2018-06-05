'use strict';

import generateDays from './generate-days.js';

let alternativeMonth = function(month, year, days, next) {
  let firstIndex = days[0].dayIndex,
    lastIndex = 6 - days[days.length - 1].dayIndex,
    newMonth = month + (next ? 1 : -1),
    newYear = year;

  if (newMonth > 11) {
    newMonth = 0;
    newYear = newYear + 1;
  }

  if (newMonth < 0) {
    newMonth = 11;
    newYear = newYear - 1;
  }

  let prevMonth = generateDays(newMonth, newYear);
  let prevMonthLength = prevMonth.length + 1;

  return !next
    ? prevMonth.slice(prevMonthLength - firstIndex - 1, prevMonthLength)
    : prevMonth.slice(0, lastIndex);
};

export default alternativeMonth;