<template>
    <div>
        <div class="ui active dimmer" v-if="loading">
            <div class="ui loader"></div>
        </div>
    <div v-else>
        <bar-chart :chart-data="splitBarProps.chartData" :width="800" :height="200" :options="{legend:{display:false}}"/>
        <metrics-chart line-color="rgb(255, 0, 0)" label-name="sumDistance" metric-name="directHeartRate" :metric-data="activity"/>
        <metrics-chart line-color="rgb(0, 102, 255)" label-name="sumDistance" metric-name="directSpeed" :metric-data="activity"/>
        <metrics-chart line-color="rgb(204, 255, 153)" label-name="sumDistance" metric-name="directElevation" :metric-data="activity"/>
    </div>
    </div>
</template>

<script>
    import BarChart from "./BarChart";
    import MetricsChart from "./MetricsChart";
    export default {
        name: "ActivityDetailCharts",
        components: {MetricsChart, BarChart},
        props: ['activityId'],
        data: function(){
            return {
                splits: null,
                activity: null
            }
        },
        computed: {
            loading: function(){
              return !(this.splits !== null && this.activity !== null);
            },
            splitBarProps: function(){
                if(this.splits !==null) {
                    var legend = [];
                    var dataSet = [{data: []}, {data: [], type: 'line'}];

                    if (this.splits != null) {
                        this.splits.lapDTOs.forEach((element, index) => {
                            legend.push("" + index);
                            dataSet[0].data.push(element.averageSpeed);
                            dataSet[1].data.push(element.averageHR / 10);
                        });


                    }
                    return {
                        chartData: {
                            labels: legend,
                            datasets: dataSet
                        },
                        chartOptions: {},
                    };
                }
                return null;
            },
        },
        created: function(){
            this.refresh();
        },
        methods: {
            refresh: function () {
                this.GM.getActivityDetails(this.activityId).then((data)=>{
                   this.activity = data;
                });
                this.GM.getSplits(this.activityId,true).then((data) => {
                    this.splits = data;
                });
            }
        }
    }
</script>

<style scoped>

</style>