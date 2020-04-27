<template>
    <tr>
        <td colspan="8">
            <div class="ui active centered inline loader" v-if="loading"></div>
            <semantic-table v-else :data="splits.lapDTOs" :column-properties="['duration','movingDuration','distance','averageSpeed']" :column-names="['Duur','Tijd bewogen','Afstand','Gem. Snelheid']"/>
        </td>
    </tr>

</template>

<script>
    import SemanticTable from "./SemanticTable";
    export default {
        name: "ActivityPreview",
        components: {SemanticTable},
        props: ['activity'],
        data: function(){
            return {
                splits: [],
                loading: false,
            }
        },
        created:function(){
            this.loading=true;

            this.GM.getSplits(this.activity.activityId).then((data)=>{
                this.splits = JSON.parse(JSON.stringify(data)); // first make a copy of the data received
                let speed = 0;
                let fastestLap = -1;
                //find the fastest split;
                this.splits.lapDTOs.forEach((element, index) => {
                    if (element.averageSpeed > speed) {
                        if (fastestLap > -1) {
                            delete this.splits.lapDTOs[fastestLap].isFastest;
                        }

                        speed = element.averageSpeed;
                        element.isFastest = true;
                        fastestLap = index;
                    }
                });

                this.splits.lapDTOs.forEach((element) => {
                    element.distance = this.$options.filters.distance(element.distance);
                    element.averageSpeed = this.$options.filters.speedFormat(element.averageSpeed);
                });
                this.loading=false;
            }).catch((error)=>{
                console.error(error);
                this.loading=false;
                this.isError = true;
            });
        }


    }
</script>

<style scoped>

</style>