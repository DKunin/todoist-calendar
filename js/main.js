import Calendar from '../vendor/vue2-event-calendar.min.js';

console.log(Calendar);
Vue.component('Calendar', Calendar);

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();

const ArrayData = [
    {
        date: `${year}-${month}-${day}`,
        title: 'buy something'
    },
    {
        date: `${year}-${month}-${day}`,
        title: 'shopping'
    },
    {
        date: `${year}-${month + 1}-2`,
        title: 'remember homework'
    },
    {
        date: `${year}-${month + 1}-15`,
        title: 'music festival'
    },
    {
        date: `${year}-${month + 2}-6`,
        title: 'a course of lectures'
    }
];
let ObjectData = {};

ArrayData.forEach(item => {
    ObjectData[item.date] = { title: item.title };
});


new Vue({
    el: '#app',
    template: `
        <div>
            <h2>hek</h2>
            <Calendar
      :dateData="dateData"
      class="ui-calendar"
      v-model="currMonth"
      locale="en">
              <div slot="header-left">
                <Button>month</Button>
                <Button>week</Button>
      <div
        :class="['ui-calendar-item', {'is-otherMonth': item.isPrevMonth || item.isNextMonth}]"
        slot-scope="item">
        <div
          :class="['ui-calendar-item-date']">
          {{item.date.date}}
        </div>
        <div class="ui-calendar-item-name">{{item.data.title}}</div>
      </div>
            </Calendar>
        </div>
    `,
    name: 'app',
    data() {
        return {
            data: new Date(),
            currMonth: new Date(),
            dateData: ArrayData,
            mode: 'month'
        };
    },
    computed: {},
    mounted() {},
    methods: {
        onMonthChange(val) {
            // console.log(val);
        },
        changeDate() {
            this.$refs.calendar.changeDate('2017-12-12');
        },
        deleteItem(title) {
            this.dateData = this.dateData.filter(item => {
                return item.title !== title;
            });
        },
        renderHeader({ prev, next, selectedDate }) {
            // console.log(selectedDate)
            const h = this.$createElement;
            const prevButton = h(
                'div',
                {
                    class: ['ui-calendar-modeBtn'],
                    on: {
                        click: prev
                    }
                },
                ['prev']
            );
            const nextButton = h(
                'div',
                {
                    class: ['ui-calendar-modeBtn'],
                    on: {
                        click: next
                    }
                },
                ['next']
            );
            const dateText = h('div', { class: ['ui-calendar-modeBtn'] }, [
                selectedDate
            ]);
            return h('div', [prevButton, dateText, nextButton]);
        }
    }
});
