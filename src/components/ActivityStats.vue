<template>
    <div>
        <h1>Statistieken</h1>
        <main-menu/>



        <div class="ui grid">
            <div class="two wide column">
                <div class="ui vertical text menu">
                    <div class="header item">Summary</div>
                    <router-link to="/charts/calories" :class="this.menuItemClass('calories')">Calories</router-link>
                    <router-link to="/charts/distance" :class="this.menuItemClass('distance')">Distance</router-link>
                    <router-link to="/charts/duration" :class="this.menuItemClass('duration')">Duration</router-link>
                    <div class="header item">Average</div>
                    <router-link to="/charts/sph" :class="this.menuItemClass('sph')">Speed per Heartbeat</router-link>
                    <router-link to="/charts/avgHeartRate" :class="this.menuItemClass('avgHeartRate')">Heartrate</router-link>
                    <router-link to="/charts/avgSpeed" :class="this.menuItemClass('avgSpeed')">Speed</router-link>
                    <router-link to="/charts/avgPace" :class="this.menuItemClass('avgPace')">Pace</router-link>
                    <router-link to="/charts/avgMovingSpeed" :class="this.menuItemClass('avgMovingSpeed')">Moving speed</router-link>
                    <div class="header item">Personal Bests</div>
                    <router-link to="/charts/prs" :class="this.menuItemClass('prs')">Personal bests</router-link>
                </div>
            </div>
            <div class="twelve wide column">
                <router-view v-on:setgroupby="onChangeGroupBy" v-on:setPeriod="onChangePeriod" :chartdata="this.chartData" v-if="!loading"/>
            </div>


        </div>

    </div>

</template>

<script>
    import MainMenu from "./MainMenu";
    export default {
        name: "ActivityStats",
        components: {MainMenu},
        created: function(){
           this.fetchData();
        },
        computed: {

        },
        data: function(){
            return {
                "graph": "calories",
                "groupBy": "",
                "period": 5,
                "chartData":null,
                "chartOptions":{},
                "loading":true
            }
        },
        methods: {
            menuItemClass: function(itemName){
                let classes = ['item'];

                if(itemName === this.graph){
                    classes.push('active');
                }
                return classes;
            },
          fetchData: function(){
              console.log('haal data op!');
              this.graph = this.$route.params.pathMatch;

              var zelf = this;
              this.GM.getSummaryData(this.graph,'','','2020-01-01','2020-05-01').then((data)=>{

                  let dataset = {data: [],label:""}
                  let chartData = {
                      datasets: [dataset],
                      labels: [],
                  };
                  for (let key in data) {
                      dataset.data.push(data[key]);
                      dataset.data.label ="";
                      chartData.labels.push(key);
                  }
                  zelf.chartData = chartData;
                  zelf.loading = false;

              })
          },
            onChangeGroupBy: function(){},
            onChangePeriod: function(){}
        },
        watch: {
            '$route': 'fetchData'
        },
    }
</script>

<style scoped>

</style>