<template>
    <div>
        <h1>Training vergelijken</h1>
        <main-menu/>


        <div class="ui active dimmer" v-if="loading">
            <div class="ui loader"></div>
        </div>


        <semantic-table
        :column-names="columnNames"
        :data="rowData"
        :column-properties="columnProperties"
        >

            <template slot="beforeHeader">
                <div class="ui labeled icon input">
                    <div class="ui label">
                        Split size:
                    </div>
                    <input type="text" placeholder="max split" v-model.number="splits" @keyup.enter="conductSearch">
                    <i class="search link icon"></i>
                </div>
            </template>
            <template slot="beforeHeaderRows" v-for="property in ['','distance','duration','averageSpeed','maxSpeed']">
                <tr v-bind:key="property">
                    <th>{{property}}</th>
                    <template v-for="activity in activities">
                        <th colspan="3" v-if="property === ''" v-bind:key="activity.summary.activityId+'_name'">
                            <router-link :to=/activity/+activity.summary.activityId>{{activity.summary.activityName}}</router-link>

                            {{activity.summary.startTimeLocal}} <a @click.prevent="removeEntry(activity.summary.activityId)">(remove)</a>

                        <th colspan="3" v-if="property !== ''" v-bind:key="activity.summary.activityId+'_'+property">{{activity.summary[property]}}</th>
                    </template>
                </tr>
            </template>

        </semantic-table>




    </div>

</template>

<script>
    import SemanticTable from "./SemanticTable";
    import MainMenu from "./MainMenu";

    export default {
        name: "CompareMatrix",
        components: {MainMenu, SemanticTable},
        data: function(){
            return {
                activityIds: [],
                activities: [],
                columnNames: [],
                columnProperties: [],
                rowData: [],
                loading: true,
                splits: 0,
            }
        },
        methods: {
            conductSearch: function(){
                console.log('refresh data after split change');
                this.refresh();
            },
            removeEntry: function(id){
                let key = ""+id;
                if(this.activityIds.indexOf(key) >= 0 && this.activityIds.length > 0) {
                    this.activityIds.splice(this.activityIds.indexOf(key), 1);
                    this.refresh();
                }
            },
            refresh: function(){
                this.loading = true;
                this.$axios.get('http://localhost/garmin/activities/compare/' + this.activityIds.join(";")).then((data) => {
                    this.massageData(data.data);
                    this.loading = false;
                });
            },
          massageData: function(data){
                console.log('massage data');
                this.columnNames = [];
                this.columnProperties = [];
                this.rowData = [];
                this.activities = [];

              data.activities.forEach((element)=>{
                  this.columnNames.push('Afstand');
                  this.columnNames.push('Gem. Snelheid');
                  this.columnNames.push('Tijd bewogen.');
                  this.activities.push(element);
                  element.summary.distance = this.$options.filters.distance(element.summary.distance);
                  element.summary.duration = this.$options.filters.duration(element.summary.duration);
                  element.summary.averageSpeed = this.$options.filters.speedFormat((element.summary.averageSpeed * 3600) /1000);
                  element.summary.maxSpeed = this.$options.filters.speedFormat((element.summary.maxSpeed * 3600) /1000);




              });

                Object.keys(data.activities).forEach((key)=>{
                    if(this.columnProperties.indexOf(key+'_distance') <0){
                        this.columnProperties.push(key+'_distance');
                    }

                    if(this.columnProperties.indexOf(key+'_avgspeed') <0){
                        this.columnProperties.push(key+'_avgspeed');
                    }

                    if(this.columnProperties.indexOf(key+'_duration') <0){
                        this.columnProperties.push(key+'_duration');
                    }
                });

                for(let i = 0; i < data.maxsplits;i++){
                    let row = {};
                    Object.keys(data.activities).forEach((key)=>{
                        console.log(this.splits);
                            let activity = data.activities[key];
                            let laps = activity.splits.lapDTOs;
                            if(this.splits>0){
                                laps = laps.filter((entry)=>{
                                    return entry.distance == this.splits;
                                });
                            }

                            if(laps.length-1 < i ){
                                row[key+'_distance'] = 0;
                                row[key+'_duration'] = 0;
                                row[key+'_avgspeed'] = 0;
                            }else{
                                let lap = laps[i];
                                row[key + '_distance'] = this.$options.filters.distance(lap.distance);
                                row[key + '_duration'] = this.$options.filters.duration(lap.duration);
                                row[key + '_avgspeed'] = this.$options.filters.speedFormat((lap.averageSpeed * 3600) / 1000);
                            }
                    });
                    this.rowData.push(row);
              }
          }
        },
        created: function(){
            if(this.$route.params.activities !== null){
                this.activityIds = this.$route.params.activities.split(";");
                this.refresh();
            }
        }
    }
</script>

<style scoped>

</style>