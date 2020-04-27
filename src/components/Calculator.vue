<template>
    <div>
        <h1>Calculator</h1>
        <main-menu/>

        <div class="ui grid">
            <div class="two wide column">
                <div class="ui vertical text menu">
                    <div class="header item">Calculator</div>
                    <router-link to="/calc/pace" :class="this.menuItemClass('pace')">Pace/Speed</router-link>
                    <router-link to="/calc/distance" :class="this.menuItemClass('distance')">Distance</router-link>
                </div>
            </div>
            <div class="twelve wide column">

                <p v-if="mode === 'Distance'">
                    distance
                </p>
                <div v-if="mode === 'Pace'">
                    <h2>Pace calculator</h2>
                <form class="ui form" >
                    <div class="inline fields">
                        <label>Time</label>
                        <div class="two wide field">
                            <input type="number" name="hours" v-model.number="pace.time.hours" placeholder="Hour">:
                        </div>
                        <div class="two wide field">
                            <input type="number" name="minutes" v-model.number="pace.time.minutes" placeholder="Minutes">:
                        </div>
                        <div class="two wide field">
                            <input type="number" name="seconds" v-model.number="pace.time.seconds" placeholder="Seconds">
                        </div>
                    </div>
                    <div class="inline fields">
                        <label>Distance</label>
                        <div class="field">
                            <input type="number" name="distance" v-model.number="pace.distance" placeholder="distance"/>
                        </div>
                    </div>

                    <div class="inline fields">
                        <label>Pace</label>
                        <div class="two wide field">
                            <input type="number" name="minutes" v-model.number="pace.pace.minutes" placeholder="Minutes">:
                        </div>
                        <div class="two wide field">
                            <input type="number" name="seconds" v-model.number="pace.pace.seconds" placeholder="Seconds">
                        </div>
                    </div>
                </form>
                <h2>Pace to speed / Speed to pace</h2>
                <form class="ui form">
                    <div class="inline fields">
                        <label>Pace</label>
                        <div class="two wide field">
                            <input type="number" v-model.number="speedtopace.minutes" name="minutes" placeholder="Minutes">:
                        </div>
                        <div class="two wide field">
                            <input type="number" v-model.number="speedtopace.seconds" name="seconds" placeholder="Seconds">
                        </div>
                    </div>
                    <div class="inline fields">
                        <label>Speed</label>
                        <div class="two wide field">
                            <input type="number" v-model.number="speedtopace.speed" name="speed" placeholder="Minutes">:
                        </div>
                    </div>
                </form>
                </div>
            </div>


        </div>


    </div>
</template>

<script>
    import MainMenu from "./MainMenu";
    export default {
        name: "Calculator",
        components: {MainMenu},
        data: function() {
            return {
                mode: 'Pace',
                pace: {
                    pace: {
                        minutes: 0,
                        seconds: 0,
                    },
                    time: {
                        hours: 0,
                        minutes: 0,
                        seconds: 0,
                    },
                    distance: 0
                },
                speedtopace :{
                    speed: 0,
                    minutes: 0,
                    seconds: 0,
                }
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
            calculateSpeedToPace: function(){
                let speed = this.speedtopace.speed * 1000; //convert to meters;
                let meterPerSecond = speed / 3600; // meter per second
                let secondsPerKilometer = (1000 / meterPerSecond);
                let secondsLeft = secondsPerKilometer % 60;
                this.speedtopace.minutes = (secondsPerKilometer - secondsLeft) / 60;
                this.speedtopace.seconds = secondsLeft;
            },
            calculatePace: function(){
                let timeSeconds = this.pace.time.hours*3600+this.pace.time.minutes*60+this.pace.time.seconds;
                let distanceMeters = this.pace.distance*1000;
                let distancePerSecond = distanceMeters/timeSeconds;
                let secondsPerKilometer = (1000/distancePerSecond);
                let secondsLeft = secondsPerKilometer % 60;
                this.pace.pace.minutes = (secondsPerKilometer - secondsLeft) / 60;
                this.pace.pace.seconds = secondsLeft;
            },
            calculatePaceToSpeed: function(){
                let seconds = (this.speedtopace.minutes * 60) + this.speedtopace.seconds;
                this.speedtopace.speed = 3600 / seconds;
            }
        },
        watch:{
            '$route': function(n,o){
                if(n!=null&&o!=null){
                    if(n.path === '/calc/pace'){
                        this.mode = 'Pace'
                    }
                    if(n.path === '/calc/distance'){
                        this.mode = 'Distance';
                    }
                }
            },
            "pace": {
                deep: true,
                handler: function(){
                    this.calculatePace();
                }
            },
            "speedtopace.seconds": function(n,o){
                if(n!==o && n!==null) {
                    this.calculatePaceToSpeed();
                }
            },
            "speedtopace.minutes": function(n,o){
                if(n!==o && n!==null) {
                    this.calculatePaceToSpeed();
                }
            },
            "speedtopace.speed": function(n,o){
                if(n!==o && n!==null) {
                    this.calculateSpeedToPace();
                }
            }
        }
    }
</script>

<style scoped>

</style>