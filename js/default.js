'use strict';

(function(window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = false;
    var useDetailPopup = true;
    var guideElement, datePicker, selectedCalendar;

    Calendar.setTimezoneOffsetCallback(function(timestamp) {
        return new Date(timestamp).getTimezoneOffset();
    });

    cal = new Calendar('#calendar', {
        defaultView: 'month',
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            allday: function(schedule) {
                return getTimeTemplate(schedule, true);
            },
            time: function(schedule) {
                return getTimeTemplate(schedule, false);
            }
        },
        week: { startDayOfWeek: 1 },
        month: { startDayOfWeek: 1 }
    });

    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];

        html.push(' ' + schedule.title);

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked =
                    options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek
                    ? 0
                    : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek
                    ? 0
                    : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked =
                    options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        // setRenderRangeText();
        // setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push(
            '<span class="calendar-bar" style="background-color: ' +
                calendar.bgColor +
                '; border-color:' +
                calendar.borderColor +
                ';"></span>'
        );
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function saveNewSchedule(scheduleData) {
        var calendar =
            scheduleData.calendar || findCalendar(scheduleData.calendarId);
        var schedule = {
            id: String(Math.random()),
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            raw: {
                class: scheduleData.raw['class'],
                location: scheduleData.raw.location
            },
            state: scheduleData.state
        };
        if (calendar) {
            schedule.calendarId = calendar.id;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.borderColor = calendar.borderColor;
        }

        cal.createSchedules([schedule]);

        refreshScheduleVisibility();
    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(
            document.querySelectorAll('#calendarList input')
        );
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked
                    ? span.style.borderColor
                    : 'transparent';
            });

            CalendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(
            document.querySelectorAll('#calendarList input')
        );

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render();

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked
                ? span.style.borderColor
                : 'transparent';
        });
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 3) {
            type = '3 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        } else {
            type = 'Monthly';
            iconClassName = 'calendar-icon ic_view_month';
        }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function setSchedules(data) {
        cal.clear();

        generateSchedule(data);

        cal.createSchedules(ScheduleList);
        refreshScheduleVisibility();
    }

    function updateCalendarEvents(auth, filter) {
        const filterCode = filter ? `?filter=${escape(filter)}` : '';
        fetch(
            `https://api.todoist.com/rest/v1/tasks${filterCode}`,
            {
                headers: {
                    Authorization: `Bearer ${auth}`
                }
            }
        )
            .then(res => res.json())
            .then(res => {
                setSchedules(res);
            })
            .catch(err => console.log(err));
    }

    function setEventListener() {
        const inputNode = document.querySelector('[name="api_key"]');
        const inputFilterNode = document.querySelector('[name="filter"]');

        inputNode.value = localStorage.getItem('apiKey') || null;
        inputFilterNode.value = localStorage.getItem('filter') || null;
        if (inputNode.value) {
            updateCalendarEvents(inputNode.value, inputFilterNode.value);
        }

        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);

        window.addEventListener('resize', resizeThrottled);

        document
            .querySelector('.js-update-data')
            .addEventListener('click', function() {
                localStorage.setItem('apiKey', inputNode.value);
                localStorage.setItem('filter', inputFilterNode.value)
                updateCalendarEvents(inputNode.value, inputFilterNode.value);
            });
    }

    function getDataAction(target) {
        return target.dataset
            ? target.dataset.action
            : target.getAttribute('data-action');
    }

    resizeThrottled = tui.util.throttle(function() {
        cal.render();
    }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setEventListener();
})(window, tui.Calendar);

// // set calendars
// (function() {
//     var calendarList = document.getElementById('calendarList');
//     var html = [];
//     CalendarList.forEach(function(calendar) {
//         html.push(
//             '<div class="lnb-calendars-item"><label>' +
//                 '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' +
//                 calendar.id +
//                 '" checked>' +
//                 '<span style="border-color: ' +
//                 calendar.borderColor +
//                 '; background-color: ' +
//                 calendar.borderColor +
//                 ';"></span>' +
//                 '<span>' +
//                 calendar.name +
//                 '</span>' +
//                 '</label></div>'
//         );
//     });

// })();
