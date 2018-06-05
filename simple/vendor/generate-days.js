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

let generateDays = function(date, daysInWeek = 7) {
    let daysArray = [];
    let index = 0;
    while (index < daysInWeek) {
        daysArray.push(index);
        index = index += 1;
    }

    const today = new Date().toDateString();
    const year = date.getFullYear();

    return daysArray.map(function(dayIndex, index) {
        const originalDate = new Date(year, date.getMonth(), date.getDate() + dayIndex);
        const day = originalDate.getDate();
        const month = originalDate.getMonth();
        const dateIndex = originalDate.getDay();

        return {
            day,
            today: today === originalDate.toDateString(),
            dateIndex,
            month,
            year,
            originalDate,
            week: currentWeekNumber(originalDate)
        };
    });
};

export default generateDays;
