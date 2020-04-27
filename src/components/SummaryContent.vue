<template>
    <semantic-card :title=title :loading="this.summary == null">
        <template v-slot:mainContent>
            <div class="ui two column grid center aligned">
            <div class="row">
                <div class="ui icon header column">
                    <i class="hashtag red icon"></i>
                    {{summary.totalWorkouts}} Workouts
                </div>
                <div class="ui icon  header column">
                    <i class="globe purple icon"></i>
                    {{summary.totalDistance | distance}}
                </div>
            </div>
            <div class="row">
                <div class="ui icon header column">
                    <i class="stopwatch teal icon"></i>
                    {{summary.totalDuration | longDuration}}
                </div>
                <div class="ui icon header column">
                    <i class="gripfire orange icon"></i>
                    {{summary.totalCalories | speedFormat}}
                </div>
            </div>
            </div>
        </template>
    </semantic-card>
</template>

<script>
    import SemanticCard from "./SemanticCard";
    export default {
        name: "SummaryContent",
        components: {SemanticCard},
        props: ['title'],
        data: function(){
            return {
                summary: null,
            }
        },
        created: function(){
            this.GM.getSummary().then((data)=>{
                this.summary = data;
            }).catch((error)=>{
                console.log(error);
            });
        }
    }
</script>