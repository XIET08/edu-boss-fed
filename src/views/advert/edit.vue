<template>
  <div>
    <create-or-update :is-edit="true" :advert-id="advertId"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'AdvertEdit',
  components: {
    CreateOrUpdate
  },
  props: {
    advertId: {
      type: [String, Number],
      required: true
    }
  }
})

</script>

<style lang="scss" scoped></style>
