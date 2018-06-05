export default function currentWeekNumber(date) {
    var instance;

    if (typeof date === 'string' && date.length) {
        instance = new Date(date);
    } else if (date instanceof Date) {
        instance = date;
    } else {
        instance = new Date();
    }

    var target = new Date(instance.valueOf());
    var dayNr = (instance.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + (4 - target.getDay() + 7) % 7);
    }
    var weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
    return weekNumber;
}
