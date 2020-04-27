<template>


        <div class="ui menu">
            <slot name="beforeDefaultItems"></slot>

            <router-link to="/" class="item">
                <i class="list alternate outline icon"/>
            </router-link>
            <router-link to="/charts" class="item">
                <i class="chart line icon"/>
            </router-link>
            <router-link to="/calc" class="item">
                <i class="calculator icon"/>
            </router-link>

            <slot name="afterDefaultItems"></slot>
            <div class="right menu">
                <slot name="rightMenu"></slot>
            </div>
        </div>

</template>

<script>
    export default {
        name: "MainMenu"
    }
</script>

<style scoped>

</style>