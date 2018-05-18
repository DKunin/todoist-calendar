'use strict';

var ScheduleList = [];

var SCHEDULE_CATEGORY = ['milestone', 'task'];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;

    this.title = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;

    this.raw = {
        memo: '',
        hasToOrCc: false,
        hasRecurrenceRule: false,
        location: null,
        class: 'public', // or 'private'
        creator: {
            name: '',
            avatar: '',
            company: '',
            email: '',
            phone: ''
        }
    };
}

function generateTime(schedule, renderStart, renderEnd) {
    schedule.isAllday = true;
    schedule.category = 'allday';

    schedule.start = renderStart;
    schedule.end = renderEnd;
}

function generateRandomSchedule(calendar, todoistItem) {
    var schedule = new ScheduleInfo();
    const renderStart = new Date(todoistItem.due.date);
    const renderEnd = new Date(todoistItem.due.date);

    schedule.id = todoistItem.id;
    schedule.calendarId = calendar.id;

    schedule.title = todoistItem.content;
    schedule.isReadOnly = false;
    generateTime(schedule, renderStart, renderEnd);

    schedule.isPrivate = false;
    schedule.location = false;
    schedule.recurrenceRule = false;

    schedule.color = calendar.color;
    schedule.bgColor = calendar.bgColor;
    schedule.dragBgColor = calendar.dragBgColor;
    schedule.borderColor = calendar.borderColor;
    ScheduleList.push(schedule);
}

function generateSchedule(data = []) {
    ScheduleList = [];
    CalendarList.forEach(function(calendar) {
        data.forEach(singleTodoistItem => {
            if (singleTodoistItem.due) {
                generateRandomSchedule(calendar, singleTodoistItem);
            }
        });
    });
}
