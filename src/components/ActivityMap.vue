<template>
    <vl-map data-projection="EPSG:4326" style="height: 400px">
        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

        <vl-layer-tile>
            <vl-source-osm></vl-source-osm>
        </vl-layer-tile>

        <vl-feature>
            <vl-geom-line-string :coordinates="coordinates"></vl-geom-line-string>
        </vl-feature>
    </vl-map>
</template>

<script>
    export default {
        name: "ActivityMap",
        props: ['activityId'],
        data: function(){
            return {
                coordinates: [],
                center: [],
                zoom: 14,
                rotation: 0,
            }
        },
        methods: {
            // i realy dont know how this works
          getcenter: function(coordinates){
              if(coordinates.length === 1){
                  return coordinates[0];
              }
              let x = 0;
              let y = 0;
              let z = 0;

              coordinates.forEach((geoCoordinate)=>{
                  let latitude = geoCoordinate.lat * Math.PI / 180;
                  let longitude = geoCoordinate.lon * Math.PI / 180;

                  x += Math.cos(latitude) * Math.cos(longitude);
                  y += Math.cos(latitude) * Math.sin(longitude);
                  z += Math.sin(latitude);
              })

              var total = coordinates.length;

              x = x / total;
              y = y / total;
              z = z / total;

              let centralLongitude = Math.atan2(y, x);
              let centralSquareRoot = Math.sqrt(x * x + y * y);
              let centralLatitude = Math.atan2(z, centralSquareRoot);

              return [( centralLongitude * 180 / Math.PI),(centralLatitude * 180 / Math.PI)];
          }
        },
        created: function(){
            console.log('activityId');
            this.GM.getActivityDetails(this.activityId).then((data)=>{
                this.center = this.getcenter(data.geoPolylineDTO.polyline);
                data.geoPolylineDTO.polyline.forEach((element)=>{
                   this.coordinates.push([element.lon,element.lat]);
                });

                console.log('calculated the coordinates!');
            });
        }

    }
</script>

<style scoped>

</style>