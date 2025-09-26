<template>
  <fieldset
    v-if="showFilters"
    data-app
    class="fieldset bg-primary-opacity-10 mb-1"
  >
    <legend>
      <v-icon>mdi-filter</v-icon>
      {{ capitalizeFirstLetter($t("filters")) }}
    </legend>
    <b-form
      ref="filterForm"
      v-model="formIsValid"
      validate-on="submit lazy"
      validated
    >
      <component
        :is="componentCrmFilter"
        ref="componentCrmFilter"
        :module-name="moduleName"
        @saveSearchFilters="saveSearchFilters"
      />
      <b-row class="pl-5 pr-5">
        <b-col
          class="m-0 pl-5 pr-5"
        >
          <b-button
            class="mt-3"
            variant="warning"
            block
            :disabled="btnDisabled"
            @click="cancelFilter"
          >
            <v-icon>mdi-close-circle</v-icon>
            {{ capitalizeFirstLetter($t('cancel')) }}
          </b-button>
        </b-col>
        <b-col
          class="m-0 pl-5 pr-5"
        >
          <b-button
            class="mt-3"
            variant="primary"
            block
            @click="clearFilter"
          >
            <v-icon>mdi-filter-minus-outline</v-icon>
            {{ capitalizeFirstLetter($t('clear')) }}
          </b-button>
        </b-col>
        <b-col
          class="m-0 pl-5 pr-5"
        >
          <b-button
            class="mt-3"
            variant="success"
            block
            :disabled="btnDisabled"
            @click="saveFilter"
          >
            <v-icon>mdi-check-bold</v-icon>
            {{ capitalizeFirstLetter($t('search')) }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </fieldset>
</template>
    
<script>
export default {
  name: "FilterTemplate",
  components: { 
  },
  props: {
    componentPath: {
      type: String,
      required: true
    },
    moduleName: {
      type: String,
      required: true
    },
    showFilters: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data()
  {
    return {
      formIsValid: false,
      searchFilters: {},
    }
  },
  computed:{
    btnDisabled(){
      return JSON.stringify(this.searchFilters) == JSON.stringify(this.$parent.searchFilters);
    },
    componentCrmFilter: function() {
      return () => import(`../../components/${this.componentPath}/${this.moduleName}/filter.vue`);
    },
  },
  mounted(){
    this.searchFilters = JSON.parse(JSON.stringify(this.$store.getters[this.moduleName + "/getSearchFilters"]));
  },
  methods:{
    cancelFilter()
    {
      this.$emit("cancelFilter");
    },
    clearFilter(){
      this.searchFilters = JSON.parse(JSON.stringify(this.$store.getters[this.moduleName + "/getDefaultContext"]['filters']));
    },
    saveFilter()
    {
      this.$emit("saveFilter", JSON.parse(JSON.stringify(this.searchFilters)));
    },
    saveSearchFilters(value){
      this.searchFilters = JSON.parse(JSON.stringify(value));
    }
  }
}
</script>