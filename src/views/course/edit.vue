<template>
  <div class="course-edit">
    <create-or-update :is-edit="true" :course-id="courseId"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  props: {
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  components: { CreateOrUpdate },
  name: 'CourseEdit'
})

</script>

<style lang="scss" scoped></style>
