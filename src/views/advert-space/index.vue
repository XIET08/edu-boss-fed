<template>
  <div class="advert-space">
     <advert-space-list/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AdvertSpaceList from './components/List.vue'

export default Vue.extend({
  name: 'AdvertSpaceIndex',
  components: {
    AdvertSpaceList
  }
})
</script>

<style lang="scss" scoped></style>
