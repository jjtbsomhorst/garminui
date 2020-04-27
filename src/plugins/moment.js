import moment from 'moment'

// insert all your axios logic here

export const m = moment;

export default {
    install (Vue) {
        Vue.prototype.$moment = m;
    }
}