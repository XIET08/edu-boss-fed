<template>
  <div>
    <el-form :model="role">
      <el-form-item label="角色名称">
        <el-input v-model="role.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code" placeholder="角色编码"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="role.description" placeholder="角色描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancle')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    // 如果是编辑操作，则根据角色ID 获取角色
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    },
    async onSubmit () {
      await createOrUpdate(this.role)
      this.$message.info('操作成功')
      this.$emit('success')
    }
  }
})

</script>

<style lang="scss" scoped></style>
