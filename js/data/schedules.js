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
    var startDate = moment(renderStart.getTime());
    var endDate = moment(renderEnd.getTime());

    schedule.isAllday = true;
    schedule.category = 'allday';
    schedule.start = startDate.toDate();
    schedule.end = endDate.toDate();
}

function generateRandomSchedule(calendar, todoistItem) {
    var schedule = new ScheduleInfo();
    const renderStart = new Date(todoistItem.due.date);
    const renderEnd = new Date(todoistItem.due.date);

    schedule.id = todoistItem.id;
    schedule.calendarId = calendar.id;

    schedule.title = todoistItem.content;
    schedule.isReadOnly = true;
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

function generateSchedule(viewName, renderStart, renderEnd) {
    ScheduleList = [];

    const exampleJson = [
        {
            id: 2647129492,
            project_id: 2168270848,
            content: 'Проект отчетности по сринтам для Тулов',
            completed: false,
            order: 255,
            indent: 1,
            priority: 1,
            comment_count: 0,
            due: { recurring: false, string: '15 May', date: '2018-05-15' },
            url: 'https://todoist.com/showTask?id=2647129492'
        },
        {
            id: 2649839213,
            project_id: 2168270848,
            content: 'Поправить поведение Pass на рабочем компе',
            completed: false,
            order: 260,
            indent: 1,
            priority: 1,
            comment_count: 0,
            due: { recurring: false, string: '15 May', date: '2018-05-15' },
            url: 'https://todoist.com/showTask?id=2649839213'
        }
    ];
    CalendarList.forEach(function(calendar) {
        exampleJson.forEach(singleTodoistItem => {
            generateRandomSchedule(calendar, singleTodoistItem);
        })
    });
}
