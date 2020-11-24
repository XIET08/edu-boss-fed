<template>
  <div class="resource">
    <list/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import List from './components/List.vue'

export default Vue.extend({
  name: 'ResourceIndex',
  components: {
    List
  }
})
</script>

<style lang="scss" scoped></style>
