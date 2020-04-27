<template>
    <semantic-card :title="getTitle()" :loading="loading">
        <template v-slot:mainContent>
            <bar-chart :chart-data="dataset" :options="{}"/>
        </template>

        <template v-slot:extraContent>
            <div class="ui four column grid">
                <div class="row">
                    <div class="two column">{{totalDistance | speedFormat}} km</div>
                    <div class="column">{{totalCalories}} kcal</div>
                    <div class="column">{{totalDuration | duration}}</div>
                </div>
                <div class="row">
                    <div class="column">
                        <button :class="getLeftClass()" @click.prevent="goBack()">
                            <i class="angle left icon"></i>
                        </button>
                    </div>
                    <div class="column"></div>
                    <div class="column"></div>
                    <div class="column">
                        <button :class="getRightClass()" @click.prevent="goForward()">
                            <i class="angle right icon"></i>
                        </button>
                    </div>


                </div>
            </div>


        </template>
    </semantic-card>

</template>

<script>
    import SemanticCard from "./SemanticCard";
    import BarChart from "./BarChart";
    import moment from "moment";
    export default {
        name: "MonthSummary",
        components: {BarChart, SemanticCard},
        data: function(){
            return {
                loading: true,
                date: new moment(),
                dataset: {},
                totalDistance: 0,
                totalCalories: 0,
                totalDuration: 0,
            }
        },

        created: function(){
            this.refresh();
        },
        methods: {
            getRightClass: function(){
                let classes = ['ui','right','floated','basic','button'];

                let now = new moment();
                let nxtmonth = this.date.clone();
                nxtmonth.add(1,'M');
                if(nxtmonth.isAfter(now)){
                    classes.push('disabled');
                }

                return classes;
            },
            getLeftClass: function(){
                return ['ui','left','floated','basic','button'];
            },
            getTitle: function(){
                return this.date.format('MMMM YYYY');
            },
            goBack: function(){
                this.date.subtract(1,'M');
                this.refresh();
            },
            goForward: function(){
                this.date.add(1,'M');
                this.refresh();
            },
            refresh: function(){
                this.loading = true;
                this.date.date(1);
                let next = this.date.clone().add(1,'M');
                let startDate = this.date.format('YYYY-MM-DD');
                let endDate = next.format('YYYY-MM-DD');
                var weeks = new Map();
                this.GM.getActivities({
                    startDate: startDate,
                    endDate: endDate,
                    sortBy: 'activityId',
                    sortOrder: 1
                }).then((data)=>{

                    this.totalDistance = 0;
                    this.totalCalories = 0;
                    this.totalDuration = 0;
                    data.forEach((element)=>{
                        let weekNumber = new moment(element.startTimeLocal).week();
                        let value = element.distance / 1000;
                        this.totalDistance += value;
                        this.totalCalories += element.calories;
                        this.totalDuration += element.movingDuration;

                        if(!weeks.has(weekNumber)){
                            weeks.set(weekNumber,value);
                        }else{
                            let currentDistance = weeks.get(weekNumber);
                            currentDistance += value;
                            weeks.set(weekNumber,currentDistance);
                        }
                    });

                    var dataSet = [{data:[]}];
                    var labels  = [];
                    weeks.forEach((value,key)=>{
                        dataSet[0].data.push(value);
                        labels.push(""+key);
                    });
                    this.dataset = {
                        datasets: dataSet,
                        labels: labels
                    };
                    this.loading = false;
                },this);
            }
        }
    }
</script>

<style scoped>

</style>