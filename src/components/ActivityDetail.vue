<template>
    <div v-if="!loading">
        <h1 class="ui header">
            <div class="content">
                {{activityName}}
                <div class="sub header">{{activity.summaryDTO.startTimeLocal}}</div>
            </div>
        </h1>
        <main-menu/>
        <div class="ui four column grid">
            <div class="row">
                <div class="four wide column column"><b>Afstand</b></div>
                <div class="four wide column">{{activity.summaryDTO.distance | distance}}</div>
                <div class="four wide column column"><b>Duur</b></div>
                <div class="four wide column">{{activity.summaryDTO.duration | duration}}</div>
            </div>
            <div class="row">
                <div class="four wide column column"><b>Gem. Snelheid</b></div>
                <div class="four wide column">{{activity.summaryDTO.averageSpeed | avgSpeed | speedFormat}}</div>
                <div class="four wide column column"><b>Max. Snelheid</b></div>
                <div class="four wide column">{{activity.summaryDTO.maxSpeed | avgSpeed | speedFormat}}</div>
            </div>
            <div class="row">
                <div class="four wide column column"><b>Gem. Bew. Snelheid</b></div>
                <div class="four wide column">{{activity.summaryDTO.averageMovingSpeed | avgSpeed | speedFormat}}</div>
                <div class="four wide column column"><b>Bew. Duur</b></div>
                <div class="four wide column">{{activity.summaryDTO.movingDuration | duration}}</div>
            </div>
            <div class="row">
                <div class="four wide column column"><b>Gem. Hartslag</b></div>
                <div class="four wide column">{{activity.summaryDTO.averageHR}}</div>
                <div class="four wide column column"><b>Max. Hartslag</b></div>
                <div class="four wide column">{{activity.summaryDTO.maxHR}}</div>
            </div>
            <div class="row">
                <div class="four wide column column"><b>Speed per Heartbeat</b></div>
                <div class="four wide column">{{activity.summaryDTO.sph}}</div>
                <div class="four wide column column"></div>
                <div class="four wide column"></div>



            </div>

        </div>
        <div class="ui divider"></div>
        <div class="ui two column grid">
            <div class="four wide column">
                <heart-rate-info :activity-id="activity.activityId"/>
            </div>

            <semantic-table class="twelve wide column" :data="splits.lapDTOs"
                            :column-names="['Duur','Tijd bewogen','Afstand','Gem. Snelheid','Gem. Hartslag','']"
                            :column-properties="['duration','movingDuration','distance','averageSpeed','averageHR','']">
                <td slot="afterBodyColumns" slot-scope="me">
                    <i v-if="me.entry.isFastest" class="trophy icon"></i>
                </td>
            </semantic-table>
        </div>
        <div class="ui container">
            <activity-map :activity-id="activity.activityId"/>
        </div>
        <div class="ui container">
            <activity-detail-charts :activity-id="activity.activityId"/>
        </div>


    </div>
</template>

<script>
    import SemanticTable from "./SemanticTable";
    import ActivityDetailCharts from "./ActivityDetailCharts";
    import HeartRateInfo from "./HeartRateInfo";
    import ActivityMap from "./ActivityMap";
    import MainMenu from "./MainMenu";

    export default {
        name: "ActivityDetail",
        components: {
            MainMenu,
            ActivityMap, HeartRateInfo,
            ActivityDetailCharts,
            SemanticTable},
        data: function () {
            return {
                activity: null,
                activitySummary: null,
                splits: null,
                activityId: null,
            }
        },
         computed: {
            activityName: function(){
                 if(this.activity != null){
                    return this.activity.activityName;
                 }
                 return '';
            },
            loading: function(){
              return (this.activity == null && this.splits == null && this.activitySummary == null);
            }
         },
        created: function () {
            this.refresh();

        },
        methods: {
            refresh: function () {
                this.activityId = this.$router.currentRoute.params.activityId;
                this.GM.getActivity(this.activityId).then((data) => {
                    data.summaryDTO.sph = data.summaryDTO.averageHR / (data.summaryDTO.averageSpeed*3.6);
                    this.activity = data;


                });
                this.GM.getActivitySummary(this.activityId).then((data)=>{
                   this.activitySummary = data;
                });
                this.GM.getSplits(this.activityId,true).then((data) => {
                        console.log('find out fastest split');
                        this.splits = JSON.parse(JSON.stringify(data)); // first make a copy of the data received
                        let speed = 0;
                        let fastestLap = -1;
                        //find the fastest split;
                        this.splits.lapDTOs.forEach((element, index) => {
                            if (element.averageSpeed > speed && element.elapsedDuration > 10) {
                                if (fastestLap > -1) {
                                    delete this.splits.lapDTOs[fastestLap].isFastest;
                                }

                                speed = element.averageSpeed;
                                element.isFastest = true;
                                fastestLap = index;
                            }
                        });

                        // format the data

                        this.splits.lapDTOs.forEach((element) => {
                            element.distance = this.$options.filters.distance(element.distance);
                            element.averageSpeed = this.$options.filters.speedFormat(element.averageSpeed);
                        });


                });




            }
        }
    }
</script>

<style scoped>

</style>