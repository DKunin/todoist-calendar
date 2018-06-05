'use strict';

import currentWeekNumber from './current-week.js';

let daysInMonthFromDate = function(date) {
    return 32 - new Date(date).getDate();
};

let daysInMonth = function(month, year) {
    return daysInMonthFromDate(new Date(year, month, 32));
};

let getDayIndex = function(month, year, index) {
    return new Date(year, month, index).getDay();
};

// https://github.com/datetime/current-week-number/blob/master/index.js

let generateDays = function(month, year, original = false) {
    let daysOfCurMonth = daysInMonth(month, year);
    let daysArray = [];
    let index = 0;

    while (index < daysOfCurMonth) {
        daysArray.push(index);
        index = index += 1;
    }
    const today = new Date().toDateString();
    return daysArray.map(function(day, i) {
        const originalDate = new Date(year, month, day);
        return {
            day: day + 1,
            today: today === originalDate.toDateString(),
            dayIndex: getDayIndex(month, year, i),
            currentMonth: original,
            month: month,
            year: year,
            originalDate,
            week: currentWeekNumber(originalDate)
        };
    });
};

export default generateDays;
