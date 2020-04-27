<template>
    <div>
        <h1>Activiteiten</h1>
        <main-menu>
            <div class="item" slot="beforeDefaultItems">
                <div class="ui icon input">
                    <input type="text" placeholder="Search..." v-model="searchTerm" @keyup.enter="conductSearch">
                    <i class="search link icon"></i>
                </div>
            </div>

            <div class="ui simple dropdown icon item">
                <i class="cog icon"></i>
                <div class="menu">
                    <div class="item" v-for="entry in columnProperties" v-bind:key="entry">{{entry}}</div>
                </div>
            </div>

            <div slot="afterDefaultItems" class="item" v-if="showResetButton" @click="resetFilters()">
                <i class="redo icon"></i>
            </div>
            <div slot="afterDefaultItems" class="ui simple dropdown icon item">
                <i class="calendar alternate outline icon"></i>
                <div class="menu">
                    <div class="item">
                        <div class="ui labeled icon input">
                            <div class="ui label">
                                Start Date:
                            </div>
                            <input type="text" placeholder="YYYY-MM-DD" v-model="startDate"
                                   @keyup.enter="conductSearch">
                            <i class="search link icon"></i>
                        </div>
                    </div>
                    <!-- sort by end date -->
                    <div class="item">
                        <div class="ui labeled icon input">
                            <div class="ui label">
                                End Date:
                            </div>
                            <input type="text" placeholder="YYYY-MM-DD" v-model="endDate" @keyup.enter="conductSearch">
                            <i class="search link icon"></i>
                        </div>

                    </div>
                </div>
            </div>

            <div slot="afterDefaultItems" class="ui simple dropdown icon item">
                <i class="tachometer alternate icon"></i>
                <div class="menu">
                    <!-- min / max distance -->
                    <div class="item">
                        <div class="ui labeled icon input">
                            <div class="ui label">
                                Min distance:
                            </div>
                            <input type="text" placeholder="min distance" v-model="minDistance"
                                   @keyup.enter="conductSearch">
                            <i class="search link icon"></i>
                        </div>
                    </div>

                    <div class="item">
                        <div class="ui labeled icon input">
                            <div class="ui label">
                                Max distance:
                            </div>
                            <input type="text" placeholder="max distance" v-model="maxDistance"
                                   @keyup.enter="conductSearch">
                            <i class="search link icon"></i>
                        </div>

                    </div>

                    <div class="item">
                        <div class="ui labeled icon input">
                            <div class="ui label">
                                Split size:
                            </div>
                            <input type="text" placeholder="max split" v-model="splits" @keyup.enter="conductSearch">
                            <i class="search link icon"></i>
                        </div>

                    </div>


                </div>
            </div>

            <div slot="afterDefaultItems" class="ui simple dropdown item">
                Workouts
                <i class="dropdown icon"></i>
                <div class="menu">
                    <div class="item" v-for="entry in workouts" v-bind:key="entry.workoutId"
                         v-on:click="filterByWorkout(entry)">{{entry.workoutName}}
                    </div>
                </div>
            </div>

            <div slot="afterDefaultItems" class="ui simple dropdown item">
                Type
                <i class="dropdown icon"></i>
                <div class="menu">
                    <a class="item" v-on:click="filterByParentType(null)" title="all">
                        <i class="fa fa-list"/>
                    </a>
                    <a class="item" v-for="entry in parentTypes.values()" v-bind:key="entry.id"
                       v-on:click="filterByParentType(entry)" v-bind:title="entry.description">
                        <i v-bind:class="entry.icon"></i>
                    </a>
                </div>
            </div>

            <a slot="afterDefaultItems" class="item" @click.prevent="gotoCompare">
                <i class="compress icon"/>
                Compare ({{compareItems.length}} items)
            </a>

            <a slot="rightMenu" class="item" v-on:click="prevPage()"><i class="caret left icon"></i></a>
            <a slot="rightMenu" class="item" v-on:click="nextPage()"><i class="caret right icon"></i></a>
        </main-menu>

        <div class="ui two column grid">
            <div class="four wide column">
                <summary-content title="Summary"/>
                <month-summary/>

            </div>
            <div class="twelve wide column">
                <div v-if="loadingTableData" class="ui active dimmer">
                    <div class="ui mini text loader">Loading</div>
                </div>
                <semantic-table v-if="!loadingTableData"
                                :data="activities"
                                :row-key="'activityId'"
                                :column-names="['Datum','Omschrijving','Afstand','Duur','Gem. Snelh','Calorien']"
                                :column-properties="columnProperties"
                                :show-links="true" v-on:link_clicked="onLinkClicked"
                                :link-prefix="'https://connect.garmin.com/modern/activity/'"
                                :entry-field="'activityId'"
                                :use-entry-slot="true">
                    <router-link slot-scope="me" :to="'/activity/'+me.entry.activityId" slot="entryColumn">
                        {{me.entry[me.property]}}
                    </router-link>
                    <th slot="beforeHeaderColumns"></th>
                    <th slot="afterHeaderColumns"></th>
                    <td slot="beforeBodyColumns" slot-scope="me">
                        <i v-bind:class="me.entry.activityType | activityIcon"/>
                    </td>
                    <td slot="afterBodyColumns" slot-scope="me">
                        <div class="ui icon tiny buttons">
                            <a target="_blank" class="ui icon button"
                               :href="'https://connect.garmin.com/modern/activity/'+me.entry.activityId"><i
                                    class="external alternate icon"></i></a>
                            <a @click.prevent="onToggleCompare(me.entry)"
                               v-bind:class="getComputedCompareIcon(me.entry.activityId)"><i class="icon compress"/></a>
                            <a target="_blank" @click.prevent="togglePreview(me.entry)" class="ui icon button"
                               v-bind:class="getComputedPreviewIcon(me.entry.activityId)"><i class="icon eye"/></a>
                        </div>
                    </td>
                    <activity-preview v-if="previewItem !== null && previewItem.activityId === me.entry.activityId"
                                      slot="afterEntryRow" slot-scope='me' :activity="previewItem"/>

                </semantic-table>
            </div>
        </div>

    </div>

</template>

<script>

    import SemanticTable from "./SemanticTable";
    import ActivityPreview from "./ActivityPreview";
    import SummaryContent from "./SummaryContent";
    import MonthSummary from "./MonthSummaryCharts";
    import MainMenu from "./MainMenu";

    export default {
        name: "ActivityList",
        data: function () {
            return {

                loadingTableData: true,
                columnProperties: ['startTimeLocal', 'activityName', 'distance', 'duration', 'averageSpeed', 'calories'],
                offset: 0,
                entrycount: 0,
                activities: [],
                parentTypes: new Map(),
                activitytypes: [],

                searchTerm: "",
                filter: {"limit": 20},
                endDate: "",
                startDate: "",
                workouts: [],
                compareItems: [],
                splits: 0,
                minDistance: 0,
                maxDistance: 0,
                showResetButton: false,
                previewItem: null
            }
        },
        components: {
            MainMenu,
            MonthSummary,
            SummaryContent,
            ActivityPreview,
            SemanticTable
        },
        watch: {

            offset: function (newvalue, oldvalue) {
                if (newvalue !== oldvalue) {
                    let f = JSON.parse(JSON.stringify(this.filter));
                    f.offset = newvalue;
                    this.filter = f;
                }
            },
            filter: function (newvalue, oldValue) {
                if (newvalue !== oldValue) {
                    if (newvalue !== {"limit": 20}) {
                        this.showResetButton = true;
                    } else {
                        this.showResetButton = false;
                    }

                    this.refresh();
                }
            }

        },
        methods: {
            resetFilters: function () {
                this.minDistance = 0;
                this.maxDistance = 0;
                this.searchTerm = "";
                this.endDate = "";
                this.startDate = "";
                this.compareItems = [];
                this.previewItem = null;
                this.splits = 0;
                this.filter = {"limit": 20};
            },
            togglePreview: function (entry) {
                if (this.previewItem === entry) {
                    this.previewItem = null;
                } else {
                    this.previewItem = entry;
                }
            },

            getComputedPreviewIcon: function (activityId) {
                let classes = ['ui', 'icon', 'button'];
                if (this.previewItem != null && this.previewItem.activityId === activityId) {
                    classes.push('active');
                }
                return classes;
            },
            getComputedCompareIcon: function (activityId) {
                let classes = ['ui', 'icon', 'button'];
                if (this.compareItems.indexOf(activityId) > -1) {
                    classes.push('active');
                }
                return classes;
            },
            gotoCompare: function () {
                if (this.compareItems.length > 0) {
                    ///compare/:activities
                    this.$router.push({name: 'compare', params: {activities: this.compareItems.join(';')}});
                }
            },
            gotoCharts: function () {
                this.$router.push({name: 'charts', params: {}});
            },

            gotoCalculator: function () {
                this.$router.push({name: 'calc', params: {}});
            },
            onToggleCompare: function (entry) {
                let indexOf = this.compareItems.indexOf(entry.activityId);
                if (indexOf >= 0) {
                    this.compareItems.splice(indexOf, 1);
                } else {
                    this.compareItems.push(entry.activityId);
                }
            },
            onLinkClicked: function (data) {
                this.$router.push({name: 'activity', params: {activityId: data.activityId}});
            },
            filterByWorkout: function (workout) {
                let f = JSON.parse(JSON.stringify(this.filter));
                if (workout == null) {
                    delete f.workout;
                } else {
                    f.workout = workout.workoutId;
                }
                this.offset = 0;
                this.filter = f;
            },
            filterByParentType: function (entry) {
                let f = JSON.parse(JSON.stringify(this.filter));
                if (entry == null) {
                    delete f.parentType;
                } else {
                    f.parentType = entry.id;
                }
                delete f.workout;

                this.offset = 0;


                this.filter = f;
            },

            conductSearch: function () {
                this.offset = 0;

                let f = JSON.parse(JSON.stringify(this.filter));
                if (this.searchTerm !== "") {
                    f.name = this.searchTerm;
                } else {
                    delete f.name;
                }

                if (this.startDate !== "") {
                    f.startDate = this.startDate;
                } else {
                    delete f.start;
                }

                if (this.endDate !== "") {
                    f.endDate = this.endDate;
                } else {
                    delete f.end;
                }

                if (parseInt(this.maxDistance) > parseInt(this.minDistance)) {
                    f.minDistance = parseInt(this.minDistance);
                    f.maxDistance = parseInt(this.maxDistance);
                }

                if (parseInt(this.splits) > 0) {
                    f.splits = this.splits;
                }


                this.filter = f;
            },
            prevPage: function () {
                if (this.offset - 20 < 0) {
                    this.offset = 0;
                } else {
                    this.offset = this.offset - 20;
                }


            },
            nextPage: function () {
                if (this.offset + 20 > this.entrycount) {
                    this.offset = this.entrycount - 20;
                } else {
                    this.offset = this.offset + 20;
                }
            },
            refresh: function () {
                this.loadingTableData = true;
                this.GM.getActivities(this.filter).then((data) => {
                    this.activities = JSON.parse(JSON.stringify(data));
                    this.activities.forEach((element) => {

                        element.startTimeLocal = this.$options.filters.datetime(element.startTimeLocal);
                        element.distance = this.$options.filters.distance(element.distance);
                        element.averageSpeed = this.$options.filters.speedFormat(element.averageSpeed);
                    });
                    this.loadingTableData = false;
                }).catch((error) => {
                    console.error(error);
                    this.loadingTableData = false;
                });
            }
        },
        created: function () {
            this.GM.getPageCount().then((data) => {
                this.entrycount = data.entrycount;
            });

            this.refresh();
            this.GM.getWorkouts().then((data) => {
                this.workouts = data;
            });

            this.GM.getActivityTypes().then((data) => {
                data.forEach((element) => {
                    if (!this.parentTypes.has(element.parentTypeId)) {
                        this.parentTypes.set(element.parentTypeId, {
                            icon: this.$options.filters.activityIcon(element),
                            id: element.parentTypeId,
                            description: this.$options.filters.activityDescription(element)
                        });
                    }
                }, this);
                this.activitytypes = data;
            });

        }


    }
</script>

<style scoped>

</style>