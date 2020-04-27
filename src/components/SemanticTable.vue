<template>
    <div>
        <slot name="beforeHeader"/>
        <slot name="header">
            <button class="ui button" @click="toggleRows()">Toon alle rijen / geselecteerde rijen</button>
            <button class="ui button" @click="removeSelection()">Verwijder selectie</button>
        </slot>
        <slot name="afterHeader"/>
        <table class="ui very compact table">
        <thead>
            <slot name="beforeHeaderRows"></slot>
            <tr>
                <slot name='beforeHeaderColumns'/>
                <th v-for="(entry,index) in columnNames" v-bind:key="index">{{entry}}</th>
                <slot name="afterHeaderColumns"/>
            </tr>
        </thead>
        <tbody>
            <template  v-for="(entry,index) in data">
            <tr :class="rowClass(index)" v-bind:key="entry[rowKey]+'_'+index" @click="selectRow(index)" v-if="visible(index)">
                <slot name="beforeBodyColumns" :entry="entry"/>
                <td v-for="(k,index) in columnProperties" v-bind:key="index" v-on:click="$emit('row-clicked',entry)">

                    <slot name="entryColumn" :entry="entry" :property="k"></slot>
                    <a v-if="showLinks && !useEntrySlot" href="" @click.prevent="$emit('link_clicked',entry)">
                    {{entry[k]}}
                    </a>
                    <span v-else-if="!useEntrySlot">{{entry[k]}}</span>
                </td>
                <slot name="afterBodyColumns" :entry="entry"/>
            </tr>
            <slot name="afterEntryRow" :entry="entry"/>
            </template>
        </tbody>
    </table>
    </div>
</template>

<script>
    export default {
        name: "SemanticTable",
        props: ['data','data-key','columnNames','columnProperties','showLinks','linkPrefix','entryField','rowKey','useEntrySlot'],
        data: function(){
          return {
              selectedRows:[],
              showSelected: false,
          }
        },
        methods: {
            removeSelection: function(){
              this.showSelected = false;
              this.selectedRows = [];
            },
            visible: function(index){
                if(this.showSelected && this.selectedRows.length > 0) {
                    return this.selectedRows.indexOf(index) >=0;
                }
                return true;
            },
            toggleRows: function(){
                this.showSelected = !this.showSelected;
            },
            rowClass: function(row){
                if(this.selectedRows.indexOf(row) >=0 ){
                    return ['warning'];
                }
                return [];
            },
            selectRow: function(row){
                let keyIndex =this.selectedRows.indexOf(row);
                if(keyIndex >= 0){
                    this.selectedRows.splice(keyIndex,1);
                }else{
                    this.selectedRows.push(row);
                }
            }
        }
    }
</script>

<style scoped>

</style>