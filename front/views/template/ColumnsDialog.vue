<template>
  <b-modal
    :visible="showSettings"
    hide-footer
    header-bg-variant="primary"
    header-text-variant="light"
    :title="capitalizeFirstLetter($t('columns'))"
  >
    <div class="d-block text-center">
      <div class="row pl-1">
        {{ capitalizeFirstLetter($t('select fields to show')) }}
      </div>
      <div class="row m-1">
        <div
          ref="availableColumnsDiv"
          class="col bg-danger-10"
        >
          <h6 class="bg-danger text-light p-1 m-0">
            {{ capitalizeFirstLetter($t('available columns')) }}
          </h6>
          <Draggable
            v-model="clonedAvailableColumns"
            class="list-group"
            group="columns"
            @end="sortLeadColumns(clonedAvailableColumns)"
          >
            <transition-group>
              <div
                v-for="column in clonedAvailableColumns"
                :key="'column_' + column.key"
                class="cursorDraggable bg-light user-select-none"
              >
                {{ capitalizeFirstLetter($te(moduleName + '.' + column.key) ? $t(moduleName + '.' + column.key) : $t(column.key)) }}
              </div>
            </transition-group>
          </Draggable>
        </div>
        <div
          ref="visibleColumns"
          class="col bg-success-10"
        >
          <h6 class="bg-success text-light p-1 m-0">
            {{ capitalizeFirstLetter($t('visible columns')) }}
          </h6>
          <Draggable
            v-model="clonedVisibleColumns"
            class="list-group"
            group="columns"
            @end="sortLeadColumns(clonedAvailableColumns)"
          >
            <transition-group>
              <div
                v-for="column in clonedVisibleColumns"
                :key="'column_' + column.key"
                class="cursorDraggable bg-light user-select-none"
              >
                {{ capitalizeFirstLetter($te(moduleName + '.' + column.key) ? $t(moduleName + '.' + column.key) : $t(column.key)) }}
              </div>
            </transition-group>
          </Draggable>
        </div>
      </div>
    </div>
  
    <b-button
      class="mt-3"
      variant="outline-danger"
      block
      @click="saveSettings"
    >
      {{ capitalizeFirstLetter($t('save')) }}
    </b-button>
    <b-button
      class="mt-2"
      variant="outline-warning"
      block
      @click="cancelSettings"
    >
      {{ capitalizeFirstLetter($t('cancel')) }}
    </b-button>
  </b-modal>
</template>
    
<script>
export default {
  name: "SettingsModal",
  components: { 
    Draggable: () => import('vuedraggable'),
  },
  props: {
    availableColumns: {
      type: Array,
      required: true
    },
    moduleName: {
      type: String,
      required: true,
      default: null
    },
    showSettings: {
      type: Boolean,
      required: true
    },
    visibleColumns: {
      type: Array,
      required: true
    },
  },
  data()
  {
    return {
      clonedVisibleColumns: [],
      clonedAvailableColumns: [],
    }
  },
  mounted()
  {
    this.clonedVisibleColumns = JSON.parse(JSON.stringify(this.visibleColumns));
    
    this.clonedAvailableColumns = JSON.parse(JSON.stringify(this.availableColumns));
    
    this.clonedVisibleColumns.forEach(element =>
    {
      const objIndex = this.clonedAvailableColumns.findIndex((obj) => obj.key == element.key);
      if (objIndex >= 0)
      {
        this.clonedAvailableColumns.splice(objIndex, 1);
      }
    });
    this.sortLeadColumns(this.clonedAvailableColumns);

    this.$root.$on('bv::modal::hide', () => {
      this.cancelSettings();
    })
  },
  methods:{
    cancelSettings()
    {
      this.$emit("cancelSettings");
    },
    saveSettings()
    {
      this.$emit("saveSettings", this.clonedAvailableColumns, this.clonedVisibleColumns);
    },
    sortLeadColumns(columnsList){
      columnsList.sort(function(a, b){
        let aName = this.capitalizeFirstLetter(this.$te(this.moduleName + '.' + a.key) ? this.$t(this.moduleName + '.' + a.key) : this.$t(a.key));
        let bName = this.capitalizeFirstLetter(this.$te(this.moduleName + '.' + b.key) ? this.$t(this.moduleName + '.' + b.key) : this.$t(b.key));
        if ( aName < bName ){
          return -1;
        }
        if ( aName > bName ){
          return 1;
        }
        return 0;
      }.bind(this)
      );
    },
  }
}
</script>

<style scoped>
.list-group{
  background-color: rgba(4, 30, 140, 0.05);
  height: calc(100% - 1.5rem);
}
.list-group>span {
  height: 100%;
}
.list-group div {
  border: 1px solid black;
}
</style>