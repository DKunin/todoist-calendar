'use strict';

import alternativeMonth from './alternative-month.js';
import generateDays from './generate-days.js';

let cachedGeneratedWeeks = {};

const validMonth = function(month) {
    return month >= 0 && month <= 11;
};

let generateWeeks = function(month, year) {
    if (!validMonth(month)) {
        throw new Error('Not a valid month');
        //return validMonth;
    }

    //'Memoization';
    let code = month + '' + year;
    if (cachedGeneratedWeeks[code] && cachedGeneratedWeeks[code].length > 0) {
        return cachedGeneratedWeeks[code];
    }

    let days = generateDays(month, year, true);
    let result = alternativeMonth(month, year, days)
        .concat(days)
        .concat(alternativeMonth(month, year, days, true));

    cachedGeneratedWeeks[code] = result;

    return result;
};

export default generateWeeks;