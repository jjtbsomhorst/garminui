<template>
    <semantic-card title="Heartrate" :loading="loading">
        <template v-slot:mainContent>
            <bar-chart :chart-data="dataset" :options="options"/>

        </template>
    </semantic-card>
</template>

<script>
    import SemanticCard from "./SemanticCard";
    import BarChart from "./BarChart";
    export default {
        name: "HeartRateInfo",
        components: {BarChart, SemanticCard},
        props: ['activityId'],
        data: function(){
            return {
                hrZones: null,
                metricsData: null,
            }
        },
        computed:{
            options: function(){
                return {
                    legend: {
                        display: false,
                    },
                    scales: {
                        yAxes: [{
                            display:false
                        }]
                    }
                }
            },
            loading: function(){
                return !(this.metricsData!=null && this.hrZones != null)
            },
            dataset: function(){

                if(this.metricsData != null && this.hrZones != null){
                    let labels = ['Zone 0','Zone 1','Zone 2','Zone 3','Zone 4','Zone 5'];
                    let data = [0,0,0,0,0,0];
                    let metricIndex = -1;
                    this.metricsData.metricDescriptors.forEach((element)=>{
                        if(element.key === 'directHeartRate'){
                            metricIndex = element.metricsIndex;
                        }
                    });

                    this.metricsData.activityDetailMetrics.forEach((element)=>{
                        let heartRate = element.metrics[metricIndex];
                        if(heartRate < this.hrZones.zone1Floor){
                            data[0] = data[0]+1;
                        }else if(heartRate < this.hrZones.zone2Floor){
                            data[1] = data[1]+1;
                        }else if(heartRate < this.hrZones.zone3Floor){
                            data[2] = data[2]+1;
                        }else if(heartRate < this.hrZones.zone4Floor){
                            data[3] = data[3]+1;
                        }else if(heartRate < this.hrZones.zone5Floor){
                            data[4] = data[4]+1;
                        }else{
                            data[5] = data[5]+1;
                        }
                    });
                    let chartData={};
                    chartData.labels = labels;
                    chartData.datasets = [];
                    chartData.datasets.push({
                       data: data,
                       backgroundColor: ['rgb(102, 255, 102)',
                                        'rgb(51, 255, 51)',
                                        'rgb(0, 255, 0)',
                                        'rgb(0, 204, 0)',
                                        'rgb(0, 153, 0)',
                                        'rgb(0, 102, 0)']
                    });
                    return chartData;
                }
                return null;
            }
        },
        methods: {
          refresh: function(){
              this.GM.getActivityDetails(this.activityId).then((data)=>{
                  this.metricsData = data;
              });
              this.GM.getHrZones().then((data)=>{
                 this.hrZones = data[0];
              });
          }
        },
        created: function(){
            this.refresh();
        }
    }
</script>

<style scoped>

</style>