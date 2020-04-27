<template>
    <bar-chart :chart-data="this.chartdata" :options="{}"/>
</template>

<script>
    import BarChart from "./BarChart";
    export default {
        name: "ActivityCharts",
        props: ['chartdata'],
        components : {BarChart},
        data: function(){
            return {
                loading: true,
            }
        },
        watch: {
          chartdata : function(n,o){
              console.log(n);
              console.log(o);
          }
        },
        created: function(){

        }

    }
</script>

<style scoped>

</style>