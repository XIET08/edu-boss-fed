<template>
  <el-card>
    <div slot="header">
      添加广告
    </div>
    <el-form :model="advertSpace" label-width="80px">
      <el-form-item label="广告名称">
        <el-input v-model="advertSpace.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  saveOrUpdateAdvertSpace,
  getAdSpaceById
} from '@/services/advert-space'

export default Vue.extend({
  name: 'CreateOrUpdate',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    advertSpaceId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      advertSpace: {
        name: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadAdvertSpace()
    }
  },
  methods: {
    async loadAdvertSpace () {
      const { data } = await getAdSpaceById(this.advertSpaceId)
      this.advertSpace = data.content
    },
    async handleSubmit () {
      const { data } = await saveOrUpdateAdvertSpace(this.advertSpace)
      this.$message.success('操作成功')
      this.$router.back()
    }
  }
})

</script>

<style lang="scss" scoped>
.el-input, .el-textarea {
  width: 70%;
}
</style>
