<template>
    <line-chart v-if="!loading" :chart-data="this.chartData" :width="800" :height="200" :options="options"/>
</template>

<script>
    import LineChart from "./LineChart";
    export default {
        name: "MetricsChart",
        components: {LineChart},
        props: ['lineColor','labelName','metricName','metricData'],
        data: function(){
            return {
                loading: true,
                chartData: {}
            }
        },
        computed: {
            options: function () {
                return {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [{
                            display: false
                        }]
                    }
                }
            }
        },
        created: function(){

            let data = [];
            let labels = [];
            let metricIndex = -1;
            let labelIndex = -1;
            this.metricData.metricDescriptors.forEach((element)=>{
               if(element.key === this.metricName){
                   metricIndex = element.metricsIndex;
               }
               if(element.key === this.labelName){
                   labelIndex = element.metricsIndex;
               }

            });

            this.metricData.activityDetailMetrics.forEach((element)=>{
               data.push(element.metrics[metricIndex]);
               labels.push(element.metrics[labelIndex]);
            });

            this.chartData.datasets = [];
            this.chartData.labels = labels;
            let set = {};
            set.borderColor = this.lineColor;
            set.borderWidth = 1;
            set.backgroundColor = set.borderColor;
            set.pointRadius = 0;
            set.fill = true;
            set.data = data;
            set.label = this.metricName;
            this.chartData.datasets.push(set);
            this.loading=false;
        }
    }
</script>

<style scoped>

</style>