const GarminFilters = {

    install(Vue){
        Vue.filter('distance', function(value){
            return Intl.NumberFormat('nl-NL',{unit: "kilometer",maximumFractionDigits:2}).format(value/1000);
        });
        Vue.filter('avgSpeed',function(value){
            return (value*3.6);
        });

        Vue.filter('speedFormat', function(value){
            return Intl.NumberFormat('nl-NL',{style: "decimal",maximumFractionDigits:2}).format(value);
        });
        Vue.filter('activityDescription',function(value){
            switch(value.parentTypeId){
                case 17: return "Other";
                case 9: return 'Walking';
                case 1: return 'Running';

                case 2: return 'Cycling';
                case 29: return 'Cardio';
                default: return value.parentTypeId;
            }
        });

        Vue.filter('duration',function(value){
            var moment = require('moment');
            let d = moment.duration(value,'seconds');
            return moment.utc(d.as('milliseconds')).format('HH:mm:ss');
        });
        Vue.filter('datetime',function(value){
           var moment = require('moment');
          return new moment(value).format('YYYY-MM-DD');
        });
        Vue.filter('longDuration',function(value){
            var moment = require('moment');
            let d = moment.duration(value,'seconds').humanize();
            return d;
        });

        Vue.filter('activityIcon',function(value){
            let icons = ['fas'];
            switch(value.parentTypeId){
                case 1:
                case 9:
                    icons.push('fa-running');
                    break;
                case 29:
                    icons.push('fa-dumbbell');
                    break;
                case 17:
                    icons.push('fa-question');
                    break;
                default:
                    icons.push('fa-biking');
                    break;
            }
            return icons;
        });
    },

};
export default GarminFilters;