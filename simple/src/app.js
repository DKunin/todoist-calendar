'use strict';

import generateWeeks  from '../vendor/weeks.js';
import currentWeek  from '../vendor/current-week.js';

const routes = [
    // { path: '/', component: listPage },
    // { path: '/settings', component: settingsPage }
];

const router = new VueRouter({ routes });

const store = new Vuex.Store({
    plugins: [],
    state: {},
    mutations: {}
});

const template = `
    <main>
        <nav>
            <router-link to="/"><span class="icon icon-list"></span></router-link>
            <router-link to="/settings"><span class="icon icon-settings"></span></router-link>
        </nav>
        <h1>My Calendar {{ currentWeek }}</h1>
        <div v-for="day in days">
            {{ day.week }} {{ day.day }} {{ day.month }} {{ day.today }}
        </div>
    </main>
`;

const app = {
    router,
    el: '#app',
    template,
    store,
    name: 'app',
    components: {
    },
    computed: {
        days() {
            const newDate = new Date();
            return generateWeeks(newDate.getMonth(), newDate.getFullYear());
        },
        currentWeek() {
            return currentWeek(new Date())
        },
        selectedWeek() {
            return 
        }
        itemsList() {
            return [];
        }
    },
    data: function() {
        return { 
            showDate: new Date() 
        };
    },
    mounted() {},
    methods: {
        setShowDate(d) {
            this.showDate = d;
        }
    }
};

export default app;
