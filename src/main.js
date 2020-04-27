import Vue from 'vue'
import App from './App.vue'
import VueAxios from './plugins/axios'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import GarminConnect from "./plugins/GarminConnectPlugin";

import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";
import CompareMatrix from "./components/CompareMatrix";
import GarminFilters from "./plugins/GarminFilters";
import ActivityStats from "./components/ActivityStats";
import ActivityPRs from "./components/ActivityPRs";
import ActivityCharts from "./components/ActivityCharts";
import Calculator from "./components/Calculator";
import {Feature, LineStringGeom, Map, OsmSource, TileLayer} from "vuelayers";

Vue.use(LineStringGeom);
Vue.use(Map);
Vue.use(TileLayer);
Vue.use(OsmSource);
Vue.use(Feature);
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueAxios);
Vue.use(VueRouter);


const routes = [
    {name: 'home', path: '/', component: ActivityList},
    {name: 'activity', path: '/activity/:activityId', component: ActivityDetail},
    {name: 'compare', path: '/compare/:activities', component: CompareMatrix},
    {
        name: 'charts',
        path: '/charts',
        component: ActivityStats,
        children: [{
            'path': 'prs',
            'component': ActivityPRs
        },
        {
            'component': ActivityCharts,
          'path': '*'
        }
        ]
    },
    {name:'calc',path:'/calc',component: Calculator, children:[{
            path:'pace'
        },
            {
                path: 'distance'
            }]}
];

const router = new VueRouter({
    routes
});

Vue.use(GarminConnect);
Vue.use(GarminFilters);
new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
