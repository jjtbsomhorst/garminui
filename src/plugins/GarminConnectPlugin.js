const GarminConnect = {

    install(Vue){
          Vue.prototype.GM = this;
          this.instance = Vue;
          this.axios = this.instance.prototype.$axios;
          this.activitysCache = new Map();
          this.parentTypes = new Map();
          this.splitCache = new Map();
          this.activityCache = new Map();
          this.activitySummaryCache = new Map();
    },

    getSplits: function(activityId,raw){
        var zelf = this;
        return new Promise((resolve,reject)=>{
            let key = activityId;
            if(raw === true){
                key +="_raw";
            }
            if(zelf.splitCache.has(key)){
                resolve(zelf.splitCache.get(key));
            }else{
                zelf.axios.get('http://localhost/garmin/activities/'+activityId+"/splits").then((response)=>{

                    response.data.lapDTOs.forEach((element)=>{
                            element.duration = zelf.instance.filter('duration').call(zelf,element.duration);
                            element.movingDuration = zelf.instance.filter('duration').call(zelf,element.movingDuration);
                            element.averageSpeed = zelf.instance.filter('avgSpeed').call(zelf, element.averageSpeed);
                            element.maxSpeed = zelf.instance.filter('avgSpeed').call(zelf, element.maxSpeed);
                        },this);
                    zelf.splitCache.set(key,response.data);
                    resolve(zelf.splitCache.get(key));
                }).catch((error)=>{
                    reject(error);
                });
            }
        },this);
    },
    getHrZones: function(){
        var zelf = this;
      return new Promise((resolve,reject)=>{
          if(zelf.activityCache.has('hrzones')){
              resolve(zelf.activityCache.get('hrzones'));
          }else{
              zelf.axios.get('http://localhost/garmin/user/hrzones').then((response)=>{
                  zelf.activityCache.set('hrzones',response.data);
                  resolve(zelf.activityCache.get('hrzones'));
                  resolve(response)
              }).catch((error)=>{
                 reject(error);
              });
          }
      });
    },

    getActivityDetails:function(activityId){
        var zelf = this;
        var key = activityId+"_details";
        return new Promise((resolve, reject) =>{
            if(zelf.activityCache.has(key)){
                resolve(zelf.activityCache.get(key));
            }else {
                zelf.axios.get('http://localhost/garmin/activities/'+activityId+"/details").then((response)=>{
                    zelf.activityCache.set(key,response.data);
                    resolve(zelf.activityCache.get(key));
                }).catch((error)=>{
                    reject(error);
                });
            }
        });
    },

    getActivitySummary: function(activityId){
        var zelf = this;
        var key = activityId+"_details";
        return new Promise((resolve, reject) =>{
            if(zelf.activitySummaryCache.has(key)){
                resolve(zelf.activitySummaryCache.get(key));
            }else {
                zelf.axios.get('http://localhost/garmin/activities/'+activityId+"/summary").then((response)=>{
                    zelf.activitySummaryCache.set(key,response.data);
                    resolve(zelf.activitySummaryCache.get(key));
                }).catch((error)=>{
                    reject(error);
                });
            }
        });
    },

    getActivity: function(activityId){
        var zelf = this;
        return new Promise((resolve, reject) => {
            if(zelf.activityCache.has(activityId)){
                resolve(zelf.activityCache.get(activityId));
            }else {
                zelf.axios.get('http://localhost/garmin/activities/'+activityId).then((response)=>{
                    zelf.activityCache.set(activityId,response.data);
                    resolve(zelf.activityCache.get(activityId));
                }).catch((error)=>{
                    reject(error);
                });
            }
        });
    },
    getActivityCount: function(){
        var zelf =this;
        return new Promise((resolve,reject)=>{
            zelf.axios.get('http://localhost/garmin/activities/types').then((data)=>{
                resolve(data.data);
            }).catch((error)=>{
                reject(error);
            });
        });
    },
    getActivityTypes: function(){
        var zelf = this;
        return new Promise((resolve,reject)=>{
           if(zelf.activityTypes){
               resolve(zelf.activityTypes);
           }else{
               return zelf.axios.get('http://localhost/garmin/activities/types').then((data)=>{
                    zelf.activityTypes = data.data;
                    resolve(zelf.activityTypes);
               }).catch((error)=>{
                   reject(error);
               });
           }
        });
    },
    getPageCount: function(){
      var zelf =this;
      return new Promise((resolve,reject)=>{
         zelf.axios.get('http://localhost/garmin/activities/count').then((data)=>{
             resolve(data);
         }).catch((data)=>{
             reject(data);
         });
      });
    },
    getWorkouts: function(){
        var zelf = this;
        return new Promise((resolve,reject)=>{
            zelf.axios.get('http://localhost/garmin/workouts',{params: {limit: 999}}).then((data)=>{
                resolve(data.data);
            }).catch((error)=>{
                reject(error);
            });
        });
    },

    getActivities: function(filter){
        var zelf = this;
        return new Promise((resolve,reject)=>{
            var key = JSON.stringify(filter);
            if(zelf.activitysCache.has(key)){
                resolve(zelf.activitysCache.get(key));
            }else {
                zelf.axios.get('http://localhost/garmin/activities', {params: filter}).then((data) => {
                    data.data.forEach((element) => {
                        element.duration = zelf.instance.filter('duration').call(zelf,element.duration);
                        element.averageSpeed = zelf.instance.filter('avgSpeed').call(zelf,element.averageSpeed);
                        element.maxSpeed =  zelf.instance.filter('avgSpeed').call(zelf,element.maxSpeed);
                    });
                    zelf.activitysCache.set(key,data.data);
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    },
    getSummary: function(){
        var zelf = this;
        return new Promise((resolve,reject)=>{
            zelf.axios.get('http://localhost/garmin/summary').then((data) => {
                    resolve(data.data);
                }).catch((error) => {
                    reject(error);
                });
            });
    },
    getSummaryData: function(type,groupby, periods,startDate,endDate){
        var zelf = this;
        let params = {};

        if(groupby !== null){
            params.groupby = groupby;
        }
        if(periods !== null){
            params.periods = periods;
        }

        if(startDate !== null){
            params.startDate = startDate;
        }

        if(endDate !== null){
            params.endDate = endDate;
        }

        return new Promise((resolve,reject)=>{
           zelf.axios.get('http://localhost/garmin/summary/'+type,{'params':params}).then((data)=>{
               resolve(data.data);
           }).catch((data)=>{
               console.log('kapot');
              reject(data);
           });
        });
    }


};

export default GarminConnect;