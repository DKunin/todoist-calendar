'use strict';

import generateDays from '../vendor/generate-days.js';
import currentWeek from '../vendor/current-week.js';
import getMondayOfTheWeek from '../vendor/get-monday-of-the-week.js';

const routes = [
    // { path: '/', component: listPage },
    // { path: '/settings', component: settingsPage }
];

const router = new VueRouter({ routes });

const store = new Vuex.Store({
    plugins: [],
    state: {
        currentWeek: currentWeek(new Date()),
        events: []
    },
    mutations: {
        incrementWeek(state) {
            Vue.set(state, 'currentWeek', state.currentWeek + 1);
        },
        decrementWeek(state) {
            Vue.set(state, 'currentWeek', state.currentWeek - 1);
        },
        updateEvents(state, newEvents) {
            Vue.set(state, 'events', newEvents);
        }
    }
});

const template = `
    <main>
        <nav>
            <router-link to="/"><span class="icon icon-list"></span></router-link>
            <router-link to="/settings"><span class="icon icon-settings"></span></router-link>
        </nav>
        <h1>My Calendar {{ currentWeek }}</h1>
        <div>
            <button @click="incrementWeek">+</button>
            <button @click="decrementWeek">-</button>
        </div>
        <div class="week-holder">
            <div v-for="day in days" class="single-week-day">
                <h4>{{ weekDays[day.dateIndex] }} {{ day.day }} {{ monthDays[day.month] }} </h4>
                <div>
                    <div v-for="event in filterItems(day)">
                        {{  event.content }}
                    </div>
                </div>
            </div>
        </div>
    </main>
`;

const app = {
    router,
    el: '#app',
    template,
    store,
    name: 'app',
    components: {},
    computed: {
        days() {
            const monday = getMondayOfTheWeek(
                this.$store.state.currentWeek,
                2018
            );
            return generateDays(monday);
        },
        currentWeek() {
            return this.$store.state.currentWeek;
        },
        itemsList() {
            return [];
        }
    },
    data: function() {
        return {
            weekDays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            monthDays: [
                'Jan',
                'Feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec'
            ]
        };
    },
    mounted() {
        const filter = '';
        const filterCode = filter ? `?filter=${escape(filter)}` : '';
        const query = new URLSearchParams(location.search);
        const auth = query.get('api');
        fetch(`https://beta.todoist.com/API/v8/tasks${filterCode}`, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
            .then(res => res.json())
            .then(res => {
                this.$store.commit('updateEvents', res);
            })
            .catch(err => console.log(err));
    },
    methods: {
        filterItems(day) {
            const selected = this.$store.state.events.filter(singleEvent => {
                if (!singleEvent.due) return false;
                return new Date(singleEvent.due.date).toLocaleDateString() === day.originalDate.toLocaleDateString();
            });
            console.log(selected);
            return selected;
        },
        incrementWeek() {
            this.$store.commit('incrementWeek');
        },
        decrementWeek() {
            this.$store.commit('decrementWeek');
        }
    }
};

export default app;
