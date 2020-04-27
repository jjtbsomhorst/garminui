<template>
  <div id="app" class="">
    <router-view/>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {  },
  data: function(){
    return {
      activeSection: 'list'
    }
  },
  methods: {
    getClass: function(elementName){
      if(elementName === this.activeSection){
        return 'active section';
      }
      return 'section';
    }
  },
  watch: {
    $route(to) {
      if(to.name === 'activity'){
        this.activeSection = 'detail';
      }
      if(to.name === 'home'){
        this.activeSection = 'list'
      }
      if(to.name === 'compare'){
        this.activeSection = 'detail';
      }
    }
  }
}
</script>