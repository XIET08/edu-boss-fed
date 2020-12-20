<template>
  <div class="resource">
    <resource-category-list/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ResourceCategoryList from './components/List.vue'

export default Vue.extend({
  name: 'ResourceCategoryIndex',
  components: {
    ResourceCategoryList
  }
})
</script>

<style lang="scss" scoped></style>
