<template>
    <div class="ui card">
        <div v-if="loading" class="ui active dimmer">
            <div class="ui mini text loader">Loading</div>
        </div>
        <template v-else>
        <div class="content" >
            <div class="header">{{title}}</div>
        </div>
        <div class="content">
            <slot name="mainContent"/>
        </div>
        <div class="extra content">
            <slot name="extraContent"/>
        </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "SemanticCard",
        props: ['title','loading'],
    }
</script>

<style scoped>

</style>